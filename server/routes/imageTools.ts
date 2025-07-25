import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import fs from 'fs/promises';
import path from 'path';

// Extend Express Request type for multer
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 40 * 1024 * 1024, // 40MB max file size
  },
  fileFilter: (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp', 'image/gif', 'image/tiff'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, WEBP, BMP, GIF, TIFF are allowed.'));
    }
  }
});

// Ensure temp directories exist
const tempDir = path.join(process.cwd(), 'temp');
const uploadsDir = path.join(tempDir, 'uploads');
const processedDir = path.join(tempDir, 'processed');

async function ensureDirs() {
  try {
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.mkdir(processedDir, { recursive: true });
  } catch (error) {
    console.error('Error creating temp directories:', error);
  }
}

ensureDirs();

// Store file sessions with expiry
interface FileSession {
  originalPath: string;
  processedPath?: string;
  expiry: Date;
}

const fileSessions = new Map<string, FileSession>();

// Clean up expired files every minute
setInterval(async () => {
  const now = new Date();
  const expiredSessions = Array.from(fileSessions.entries()).filter(([, session]) => now > session.expiry);
  
  for (const [sessionId, session] of expiredSessions) {
    try {
      await fs.unlink(session.originalPath).catch(() => {});
      if (session.processedPath) {
        await fs.unlink(session.processedPath).catch(() => {});
      }
      fileSessions.delete(sessionId);
    } catch (error) {
      console.error('Error cleaning up expired files:', error);
    }
  }
}, 60000);

// Crop Image Tool
router.post('/crop', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { x, y, width, height } = req.body;

    // Validate crop parameters
    const cropX = parseInt(x);
    const cropY = parseInt(y);
    const cropWidth = parseInt(width);
    const cropHeight = parseInt(height);

    if (isNaN(cropX) || isNaN(cropY) || isNaN(cropWidth) || isNaN(cropHeight)) {
      return res.status(400).json({ error: 'Invalid crop parameters' });
    }

    const sessionId = uuidv4();
    const originalFileName = `${sessionId}_original.${req.file.originalname.split('.').pop()}`;
    const croppedFileName = `${sessionId}_cropped.png`;
    
    const originalPath = path.join(uploadsDir, originalFileName);
    const croppedPath = path.join(processedDir, croppedFileName);

    // Save original file
    await fs.writeFile(originalPath, req.file.buffer);

    // Process cropping
    await sharp(req.file.buffer)
      .extract({ left: cropX, top: cropY, width: cropWidth, height: cropHeight })
      .png({ quality: 100 })
      .toFile(croppedPath);

    // Get file stats
    const croppedStats = await fs.stat(croppedPath);
    const croppedBuffer = await fs.readFile(croppedPath);
    const { width: finalWidth, height: finalHeight } = await sharp(croppedBuffer).metadata();

    // Store session with 4-minute expiry
    const expiry = new Date(Date.now() + 4 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPath,
      processedPath: croppedPath,
      expiry
    });

    res.json({
      sessionId,
      success: true,
      fileName: `cropped_${req.file.originalname.split('.')[0]}.png`,
      size: croppedStats.size,
      dimensions: { width: finalWidth, height: finalHeight },
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('Crop error:', error);
    res.status(500).json({ error: 'Failed to crop image. Please try again.' });
  }
});

// Compress Image Tool
router.post('/compress', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { mode, targetSize, keepExif, resizeWidth, resizeHeight } = req.body;

    const sessionId = uuidv4();
    const originalFileName = `${sessionId}_original.${req.file.originalname.split('.').pop()}`;
    const compressedFileName = `${sessionId}_compressed.${req.file.originalname.split('.').pop()}`;
    
    const originalPath = path.join(uploadsDir, originalFileName);
    const compressedPath = path.join(processedDir, compressedFileName);

    // Save original file
    await fs.writeFile(originalPath, req.file.buffer);

    let sharpInstance = sharp(req.file.buffer);

    // Apply resize if specified
    if (resizeWidth && resizeHeight) {
      sharpInstance = sharpInstance.resize(parseInt(resizeWidth), parseInt(resizeHeight));
    }

    // Apply compression based on mode
    let quality = 80;
    switch (mode) {
      case 'lossless':
        quality = 100;
        break;
      case 'balanced':
        quality = 80;
        break;
      case 'high':
        quality = 60;
        break;
      case 'auto':
      default:
        quality = 85;
        break;
    }

    // Get original metadata
    const originalMetadata = await sharp(req.file.buffer).metadata();
    const originalSize = req.file.size;

    // Process compression based on file type
    if (req.file.mimetype === 'image/png') {
      sharpInstance = sharpInstance.png({ 
        quality,
        compressionLevel: mode === 'high' ? 9 : 6
      });
    } else if (req.file.mimetype === 'image/webp') {
      sharpInstance = sharpInstance.webp({ quality });
    } else {
      sharpInstance = sharpInstance.jpeg({ 
        quality,
        progressive: true
      });
    }

    // Save compressed image
    await sharpInstance.toFile(compressedPath);

    // Get compressed file stats
    const compressedStats = await fs.stat(compressedPath);
    const compressionRatio = Math.round((1 - compressedStats.size / originalSize) * 100);

    // Store session with 4-minute expiry
    const expiry = new Date(Date.now() + 4 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPath,
      processedPath: compressedPath,
      expiry
    });

    res.json({
      sessionId,
      success: true,
      fileName: `compressed_${req.file.originalname}`,
      originalSize,
      compressedSize: compressedStats.size,
      compressionRatio,
      dimensions: { width: originalMetadata.width, height: originalMetadata.height },
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('Compress error:', error);
    res.status(500).json({ error: 'Failed to compress image. Please try again.' });
  }
});

// Convert Image Tool
router.post('/convert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { targetFormat, preserveTransparency, grayscale, resizeWidth, resizeHeight } = req.body;

    const sessionId = uuidv4();
    const originalFileName = `${sessionId}_original.${req.file.originalname.split('.').pop()}`;
    const convertedFileName = `${sessionId}_converted.${targetFormat.toLowerCase()}`;
    
    const originalPath = path.join(uploadsDir, originalFileName);
    const convertedPath = path.join(processedDir, convertedFileName);

    // Save original file
    await fs.writeFile(originalPath, req.file.buffer);

    let sharpInstance = sharp(req.file.buffer);

    // Apply resize if specified
    if (resizeWidth && resizeHeight) {
      sharpInstance = sharpInstance.resize(parseInt(resizeWidth), parseInt(resizeHeight));
    }

    // Apply grayscale if requested
    if (grayscale === 'true') {
      sharpInstance = sharpInstance.grayscale();
    }

    // Convert to target format
    switch (targetFormat.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: 95 });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ 
          quality: 95,
          ...(preserveTransparency === 'true' ? {} : { palette: true })
        });
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp({ 
          quality: 95,
          lossless: preserveTransparency === 'true'
        });
        break;
      case 'bmp':
        // Sharp doesn't support BMP output, use PNG instead
        sharpInstance = sharpInstance.png({ quality: 95 });
        break;
      case 'gif':
        // Sharp doesn't support GIF output, fallback to PNG
        sharpInstance = sharpInstance.png({ quality: 95 });
        break;
      case 'tiff':
        sharpInstance = sharpInstance.tiff({ quality: 95 });
        break;
      default:
        return res.status(400).json({ error: 'Unsupported target format' });
    }

    // Save converted image
    await sharpInstance.toFile(convertedPath);

    // Get converted file stats
    const convertedStats = await fs.stat(convertedPath);
    const convertedBuffer = await fs.readFile(convertedPath);
    const { width, height } = await sharp(convertedBuffer).metadata();

    // Store session with 4-minute expiry
    const expiry = new Date(Date.now() + 4 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPath,
      processedPath: convertedPath,
      expiry
    });

    res.json({
      sessionId,
      success: true,
      fileName: `converted_${req.file.originalname.split('.')[0]}.${targetFormat.toLowerCase()}`,
      originalSize: req.file.size,
      convertedSize: convertedStats.size,
      dimensions: { width, height },
      format: targetFormat.toUpperCase(),
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('Convert error:', error);
    res.status(500).json({ error: 'Failed to convert image. Please try again.' });
  }
});

// Download processed image
router.get('/download/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = fileSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found or expired' });
    }

    if (new Date() > session.expiry) {
      // Clean up expired session
      await fs.unlink(session.originalPath).catch(() => {});
      if (session.processedPath) {
        await fs.unlink(session.processedPath).catch(() => {});
      }
      fileSessions.delete(sessionId);
      return res.status(410).json({ error: 'Download link has expired' });
    }

    if (!session.processedPath) {
      return res.status(404).json({ error: 'Processed file not found' });
    }

    // Get file info
    const fileName = path.basename(session.processedPath);
    const mimeType = mime.lookup(session.processedPath) || 'application/octet-stream';

    // Set headers for download
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Stream the file
    const fileBuffer = await fs.readFile(session.processedPath);
    res.send(fileBuffer);

    // Clean up after download
    setTimeout(async () => {
      try {
        await fs.unlink(session.originalPath).catch(() => {});
        if (session.processedPath) {
          await fs.unlink(session.processedPath).catch(() => {});
        }
        fileSessions.delete(sessionId);
      } catch (error) {
        console.error('Error cleaning up after download:', error);
      }
    }, 1000);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Get session status
router.get('/status/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = fileSessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const now = new Date();
  if (now > session.expiry) {
    fileSessions.delete(sessionId);
    return res.status(410).json({ error: 'Session expired' });
  }

  const timeLeft = Math.floor((session.expiry.getTime() - now.getTime()) / 1000);
  res.json({
    sessionId,
    timeLeft,
    expiresAt: session.expiry.toISOString()
  });
});

export default router;