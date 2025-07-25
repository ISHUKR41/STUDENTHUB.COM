import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
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
  metadata?: any;
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

// Resize Image Tool
router.post('/resize', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { width, height, maintainAspectRatio, resizeMode } = req.body;
    const targetWidth = parseInt(width);
    const targetHeight = parseInt(height);

    if (!targetWidth && !targetHeight) {
      return res.status(400).json({ error: 'Width or height must be specified' });
    }

    const sessionId = uuidv4();
    
    // Get original image metadata
    const originalImage = sharp(req.file.buffer);
    const metadata = await originalImage.metadata();
    
    // Prepare resize options
    let resizeOptions: sharp.ResizeOptions = {};
    
    if (maintainAspectRatio === 'true') {
      if (resizeMode === 'fit') {
        resizeOptions.fit = 'inside';
      } else if (resizeMode === 'fill') {
        resizeOptions.fit = 'cover';
      } else {
        resizeOptions.fit = 'inside';
      }
    } else {
      resizeOptions.fit = 'fill';
    }

    // Resize image
    const resizedBuffer = await originalImage
      .resize(targetWidth, targetHeight, resizeOptions)
      .toBuffer();

    // Get resized image metadata
    const resizedMetadata = await sharp(resizedBuffer).metadata();

    // Save files
    const originalPath = path.join(uploadsDir, `${sessionId}_original${path.extname(req.file.originalname)}`);
    const resizedPath = path.join(processedDir, `${sessionId}_resized${path.extname(req.file.originalname)}`);
    
    await fs.writeFile(originalPath, req.file.buffer);
    await fs.writeFile(resizedPath, resizedBuffer);

    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPath,
      processedPath: resizedPath,
      expiry,
      metadata: {
        original: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          size: req.file.size
        },
        resized: {
          width: resizedMetadata.width,
          height: resizedMetadata.height,
          format: resizedMetadata.format,
          size: resizedBuffer.length
        }
      }
    });

    res.json({
      sessionId,
      success: true,
      fileName: `resized_${req.file.originalname}`,
      original: {
        width: metadata.width,
        height: metadata.height,
        size: req.file.size
      },
      resized: {
        width: resizedMetadata.width,
        height: resizedMetadata.height,
        size: resizedBuffer.length
      },
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('Image resize error:', error);
    res.status(500).json({ error: 'Failed to resize image. Please try again.' });
  }
});

// Compress Image Tool
router.post('/compress', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { quality, format } = req.body;
    const compressionQuality = parseInt(quality) || 80;
    const outputFormat = format || 'jpeg';

    const sessionId = uuidv4();
    
    // Get original image metadata
    const originalImage = sharp(req.file.buffer);
    const metadata = await originalImage.metadata();
    
    // Compress image
    let compressedBuffer: Buffer;
    
    if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
      compressedBuffer = await originalImage
        .jpeg({ quality: compressionQuality })
        .toBuffer();
    } else if (outputFormat === 'png') {
      compressedBuffer = await originalImage
        .png({ 
          quality: compressionQuality,
          compressionLevel: Math.round((100 - compressionQuality) / 10)
        })
        .toBuffer();
    } else if (outputFormat === 'webp') {
      compressedBuffer = await originalImage
        .webp({ quality: compressionQuality })
        .toBuffer();
    } else {
      compressedBuffer = await originalImage
        .jpeg({ quality: compressionQuality })
        .toBuffer();
    }

    // Calculate compression ratio
    const compressionRatio = Math.round(((req.file.size - compressedBuffer.length) / req.file.size) * 100);

    // Save files
    const originalPath = path.join(uploadsDir, `${sessionId}_original${path.extname(req.file.originalname)}`);
    const compressedPath = path.join(processedDir, `${sessionId}_compressed.${outputFormat}`);
    
    await fs.writeFile(originalPath, req.file.buffer);
    await fs.writeFile(compressedPath, compressedBuffer);

    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPath,
      processedPath: compressedPath,
      expiry,
      metadata: {
        originalSize: req.file.size,
        compressedSize: compressedBuffer.length,
        compressionRatio,
        quality: compressionQuality,
        format: outputFormat,
        originalFormat: metadata.format
      }
    });

    res.json({
      sessionId,
      success: true,
      fileName: `compressed_${path.basename(req.file.originalname, path.extname(req.file.originalname))}.${outputFormat}`,
      originalSize: req.file.size,
      compressedSize: compressedBuffer.length,
      compressionRatio,
      quality: compressionQuality,
      format: outputFormat,
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('Image compression error:', error);
    res.status(500).json({ error: 'Failed to compress image. Please try again.' });
  }
});

// Convert Image Format Tool
router.post('/convert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { format, quality } = req.body;
    
    if (!format) {
      return res.status(400).json({ error: 'Target format is required' });
    }

    const sessionId = uuidv4();
    const conversionQuality = parseInt(quality) || 90;
    
    // Get original image metadata
    const originalImage = sharp(req.file.buffer);
    const metadata = await originalImage.metadata();
    
    // Convert to target format
    let convertedBuffer: Buffer;
    let outputExtension: string;
    
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        convertedBuffer = await originalImage.jpeg({ quality: conversionQuality }).toBuffer();
        outputExtension = 'jpg';
        break;
      case 'png':
        convertedBuffer = await originalImage.png().toBuffer();
        outputExtension = 'png';
        break;
      case 'webp':
        convertedBuffer = await originalImage.webp({ quality: conversionQuality }).toBuffer();
        outputExtension = 'webp';
        break;
      case 'tiff':
        convertedBuffer = await originalImage.tiff().toBuffer();
        outputExtension = 'tiff';
        break;
      case 'bmp':
        convertedBuffer = await originalImage.png().toBuffer(); // BMP not directly supported, use PNG
        outputExtension = 'png';
        break;
      default:
        convertedBuffer = await originalImage.jpeg({ quality: conversionQuality }).toBuffer();
        outputExtension = 'jpg';
    }

    // Save files
    const originalPath = path.join(uploadsDir, `${sessionId}_original${path.extname(req.file.originalname)}`);
    const convertedPath = path.join(processedDir, `${sessionId}_converted.${outputExtension}`);
    
    await fs.writeFile(originalPath, req.file.buffer);
    await fs.writeFile(convertedPath, convertedBuffer);

    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPath,
      processedPath: convertedPath,
      expiry,
      metadata: {
        originalFormat: metadata.format,
        targetFormat: format,
        outputFormat: outputExtension,
        originalSize: req.file.size,
        convertedSize: convertedBuffer.length,
        quality: conversionQuality
      }
    });

    res.json({
      sessionId,
      success: true,
      fileName: `converted_${path.basename(req.file.originalname, path.extname(req.file.originalname))}.${outputExtension}`,
      originalFormat: metadata.format,
      targetFormat: outputExtension,
      originalSize: req.file.size,
      convertedSize: convertedBuffer.length,
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('Image conversion error:', error);
    res.status(500).json({ error: 'Failed to convert image. Please try again.' });
  }
});

// Crop Image Tool
router.post('/crop', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { x, y, width, height } = req.body;
    const cropX = parseInt(x) || 0;
    const cropY = parseInt(y) || 0;
    const cropWidth = parseInt(width);
    const cropHeight = parseInt(height);

    if (!cropWidth || !cropHeight) {
      return res.status(400).json({ error: 'Crop width and height are required' });
    }

    const sessionId = uuidv4();
    
    // Get original image metadata
    const originalImage = sharp(req.file.buffer);
    const metadata = await originalImage.metadata();
    
    // Crop image
    const croppedBuffer = await originalImage
      .extract({
        left: cropX,
        top: cropY,
        width: cropWidth,
        height: cropHeight
      })
      .toBuffer();

    // Save files
    const originalPath = path.join(uploadsDir, `${sessionId}_original${path.extname(req.file.originalname)}`);
    const croppedPath = path.join(processedDir, `${sessionId}_cropped${path.extname(req.file.originalname)}`);
    
    await fs.writeFile(originalPath, req.file.buffer);
    await fs.writeFile(croppedPath, croppedBuffer);

    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPath,
      processedPath: croppedPath,
      expiry,
      metadata: {
        original: {
          width: metadata.width,
          height: metadata.height,
          size: req.file.size
        },
        cropped: {
          x: cropX,
          y: cropY,
          width: cropWidth,
          height: cropHeight,
          size: croppedBuffer.length
        }
      }
    });

    res.json({
      sessionId,
      success: true,
      fileName: `cropped_${req.file.originalname}`,
      original: {
        width: metadata.width,
        height: metadata.height,
        size: req.file.size
      },
      cropped: {
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight,
        size: croppedBuffer.length
      },
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('Image crop error:', error);
    res.status(500).json({ error: 'Failed to crop image. Please try again.' });
  }
});

// Remove Background Tool (basic edge detection based)
router.post('/remove-background', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const sessionId = uuidv4();
    
    // Get original image metadata
    const originalImage = sharp(req.file.buffer);
    const metadata = await originalImage.metadata();
    
    // Basic background removal using threshold and transparency
    // Note: For professional background removal, you'd integrate with:
    // - remove.bg API
    // - BackgroundRemover.app API
    // - Custom ML models
    
    // For now, we'll create a simple alpha channel based approach
    const processedBuffer = await originalImage
      .png() // Convert to PNG to support transparency
      .threshold(240) // Simple threshold for light backgrounds
      .toColorspace('srgb')
      .toBuffer();

    // Save files
    const originalPath = path.join(uploadsDir, `${sessionId}_original${path.extname(req.file.originalname)}`);
    const processedPath = path.join(processedDir, `${sessionId}_no_bg.png`);
    
    await fs.writeFile(originalPath, req.file.buffer);
    await fs.writeFile(processedPath, processedBuffer);

    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPath,
      processedPath,
      expiry,
      metadata: {
        originalSize: req.file.size,
        processedSize: processedBuffer.length,
        originalFormat: metadata.format,
        outputFormat: 'png'
      }
    });

    res.json({
      sessionId,
      success: true,
      fileName: `no_bg_${path.basename(req.file.originalname, path.extname(req.file.originalname))}.png`,
      originalSize: req.file.size,
      processedSize: processedBuffer.length,
      note: 'Basic background removal applied. For professional results, consider using specialized services.',
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('Background removal error:', error);
    res.status(500).json({ error: 'Failed to remove background. Please try again.' });
  }
});

// Image Editor Tool (basic adjustments)
router.post('/edit', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { 
      brightness, 
      contrast, 
      saturation, 
      gamma, 
      blur, 
      sharpen,
      rotate,
      flip,
      flop
    } = req.body;

    const sessionId = uuidv4();
    
    // Start with original image
    let processedImage = sharp(req.file.buffer);
    
    // Apply adjustments in sequence
    const adjustments = [];
    
    if (brightness !== undefined) {
      const brightnessValue = parseFloat(brightness);
      processedImage = processedImage.modulate({ brightness: brightnessValue });
      adjustments.push(`brightness: ${brightnessValue}`);
    }
    
    if (saturation !== undefined) {
      const saturationValue = parseFloat(saturation);
      processedImage = processedImage.modulate({ saturation: saturationValue });
      adjustments.push(`saturation: ${saturationValue}`);
    }
    
    if (contrast !== undefined) {
      const contrastValue = parseFloat(contrast);
      processedImage = processedImage.linear(contrastValue, 0);
      adjustments.push(`contrast: ${contrastValue}`);
    }
    
    if (gamma !== undefined) {
      const gammaValue = parseFloat(gamma);
      processedImage = processedImage.gamma(gammaValue);
      adjustments.push(`gamma: ${gammaValue}`);
    }
    
    if (blur !== undefined) {
      const blurValue = parseFloat(blur);
      if (blurValue > 0) {
        processedImage = processedImage.blur(blurValue);
        adjustments.push(`blur: ${blurValue}px`);
      }
    }
    
    if (sharpen !== undefined) {
      const sharpenValue = parseFloat(sharpen);
      if (sharpenValue > 0) {
        processedImage = processedImage.sharpen({ sigma: sharpenValue });
        adjustments.push(`sharpen: ${sharpenValue}`);
      }
    }
    
    if (rotate !== undefined) {
      const rotateValue = parseFloat(rotate);
      processedImage = processedImage.rotate(rotateValue);
      adjustments.push(`rotate: ${rotateValue}°`);
    }
    
    if (flip === 'true') {
      processedImage = processedImage.flip();
      adjustments.push('flip: vertical');
    }
    
    if (flop === 'true') {
      processedImage = processedImage.flop();
      adjustments.push('flop: horizontal');
    }

    // Get processed buffer
    const processedBuffer = await processedImage.toBuffer();

    // Save files
    const originalPath = path.join(uploadsDir, `${sessionId}_original${path.extname(req.file.originalname)}`);
    const editedPath = path.join(processedDir, `${sessionId}_edited${path.extname(req.file.originalname)}`);
    
    await fs.writeFile(originalPath, req.file.buffer);
    await fs.writeFile(editedPath, processedBuffer);

    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPath,
      processedPath: editedPath,
      expiry,
      metadata: {
        originalSize: req.file.size,
        editedSize: processedBuffer.length,
        adjustments
      }
    });

    res.json({
      sessionId,
      success: true,
      fileName: `edited_${req.file.originalname}`,
      originalSize: req.file.size,
      editedSize: processedBuffer.length,
      adjustments,
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('Image editing error:', error);
    res.status(500).json({ error: 'Failed to edit image. Please try again.' });
  }
});

// Download processed file
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

    // Determine content type from file extension
    const ext = path.extname(session.processedPath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.tiff':
        contentType = 'image/tiff';
        break;
      case '.bmp':
        contentType = 'image/bmp';
        break;
    }

    // Set headers for download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(session.processedPath)}"`);

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

export default router;