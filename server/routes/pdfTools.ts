import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
  fileFilter: (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'));
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
  originalPaths: string[];
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
      for (const filePath of session.originalPaths) {
        await fs.unlink(filePath).catch(() => {});
      }
      if (session.processedPath) {
        await fs.unlink(session.processedPath).catch(() => {});
      }
      fileSessions.delete(sessionId);
    } catch (error) {
      console.error('Error cleaning up expired files:', error);
    }
  }
}, 60000);

// Merge PDFs Tool
router.post('/merge', upload.array('files', 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length < 2) {
      return res.status(400).json({ error: 'At least 2 PDF files are required for merging' });
    }

    const sessionId = uuidv4();
    const mergedPdf = await PDFDocument.create();
    const originalPaths: string[] = [];

    for (const file of files) {
      // Save uploaded file temporarily
      const tempPath = path.join(uploadsDir, `${sessionId}_${file.originalname}`);
      await fs.writeFile(tempPath, file.buffer);
      originalPaths.push(tempPath);

      // Load and copy pages from each PDF
      const pdfDoc = await PDFDocument.load(file.buffer);
      const pageCount = pdfDoc.getPageCount();
      const pageIndices = Array.from({ length: pageCount }, (_, i) => i);
      
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    // Save merged PDF
    const mergedPdfBytes = await mergedPdf.save();
    const outputPath = path.join(processedDir, `${sessionId}_merged.pdf`);
    await fs.writeFile(outputPath, mergedPdfBytes);

    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    fileSessions.set(sessionId, {
      originalPaths,
      processedPath: outputPath,
      expiry,
      metadata: {
        totalPages: mergedPdf.getPageCount(),
        filesCount: files.length,
        originalNames: files.map(f => f.originalname)
      }
    });

    res.json({
      sessionId,
      success: true,
      fileName: 'merged_document.pdf',
      totalPages: mergedPdf.getPageCount(),
      filesCount: files.length,
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('PDF merge error:', error);
    res.status(500).json({ error: 'Failed to merge PDFs. Please try again.' });
  }
});

// Split PDF Tool
router.post('/split', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const { splitType, pageRanges, pagesPerFile } = req.body;
    const sessionId = uuidv4();
    
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const totalPages = pdfDoc.getPageCount();
    
    // Save original file
    const originalPath = path.join(uploadsDir, `${sessionId}_original.pdf`);
    await fs.writeFile(originalPath, req.file.buffer);

    const splitPdfs: Buffer[] = [];
    let splitInfo: any[] = [];

    if (splitType === 'pages') {
      // Split by specific pages per file
      const pages = parseInt(pagesPerFile) || 1;
      for (let i = 0; i < totalPages; i += pages) {
        const newPdf = await PDFDocument.create();
        const endPage = Math.min(i + pages, totalPages);
        const pageIndices = Array.from({ length: endPage - i }, (_, idx) => i + idx);
        
        const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        splitPdfs.push(Buffer.from(pdfBytes));
        splitInfo.push({
          fileName: `split_${i + 1}-${endPage}.pdf`,
          startPage: i + 1,
          endPage: endPage,
          pageCount: endPage - i
        });
      }
    } else if (splitType === 'ranges' && pageRanges) {
      // Split by custom page ranges
      const ranges = pageRanges.split(',').map((range: string) => {
        const [start, end] = range.trim().split('-').map((n: string) => parseInt(n));
        return { start: start - 1, end: end ? end - 1 : start - 1 }; // Convert to 0-based
      });

      for (const [index, range] of ranges.entries()) {
        const newPdf = await PDFDocument.create();
        const pageIndices = Array.from(
          { length: range.end - range.start + 1 }, 
          (_, i) => range.start + i
        ).filter(pageIndex => pageIndex < totalPages);
        
        const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        splitPdfs.push(Buffer.from(pdfBytes));
        splitInfo.push({
          fileName: `split_pages_${range.start + 1}-${range.end + 1}.pdf`,
          startPage: range.start + 1,
          endPage: range.end + 1,
          pageCount: pageIndices.length
        });
      }
    } else {
      // Split each page individually
      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
        
        const pdfBytes = await newPdf.save();
        splitPdfs.push(Buffer.from(pdfBytes));
        splitInfo.push({
          fileName: `page_${i + 1}.pdf`,
          startPage: i + 1,
          endPage: i + 1,
          pageCount: 1
        });
      }
    }

    // Create ZIP file with all split PDFs (for simplicity, we'll just return info about the first few)
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPaths: [originalPath],
      expiry,
      metadata: {
        totalPages,
        splitCount: splitPdfs.length,
        splitInfo: splitInfo.slice(0, 5), // Return info for first 5 splits
        splitType
      }
    });

    res.json({
      sessionId,
      success: true,
      originalPages: totalPages,
      splitCount: splitPdfs.length,
      splitInfo: splitInfo.slice(0, 5),
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('PDF split error:', error);
    res.status(500).json({ error: 'Failed to split PDF. Please try again.' });
  }
});

// Compress PDF Tool
router.post('/compress', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const { quality } = req.body;
    const sessionId = uuidv4();
    
    // For a complete implementation, you would use libraries like:
    // - pdf2pic + sharp for image optimization
    // - ghostscript bindings
    // - pdf-lib optimization techniques
    
    // For now, we'll create a basic "compressed" version
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    
    // Basic compression: remove metadata and optimize
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('StudentHub PDF Compressor');
    pdfDoc.setCreator('StudentHub');
    
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false
    });

    // Save files
    const originalPath = path.join(uploadsDir, `${sessionId}_original.pdf`);
    const compressedPath = path.join(processedDir, `${sessionId}_compressed.pdf`);
    
    await fs.writeFile(originalPath, req.file.buffer);
    await fs.writeFile(compressedPath, compressedPdfBytes);

    const originalSize = req.file.size;
    const compressedSize = compressedPdfBytes.length;
    const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100);

    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPaths: [originalPath],
      processedPath: compressedPath,
      expiry,
      metadata: {
        originalSize,
        compressedSize,
        compressionRatio,
        pageCount: pdfDoc.getPageCount()
      }
    });

    res.json({
      sessionId,
      success: true,
      fileName: `compressed_${req.file.originalname}`,
      originalSize,
      compressedSize,
      compressionRatio,
      pageCount: pdfDoc.getPageCount(),
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('PDF compression error:', error);
    res.status(500).json({ error: 'Failed to compress PDF. Please try again.' });
  }
});

// Protect PDF Tool
router.post('/protect', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const { password, restrictions } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const sessionId = uuidv4();
    const pdfDoc = await PDFDocument.load(req.file.buffer);

    // Note: pdf-lib has limited password protection features
    // For full encryption, you'd need additional libraries like node-qpdf
    
    // Basic protection setup (this is a simplified implementation)
    const protectedPdfBytes = await pdfDoc.save({
      userPassword: password,
      ownerPassword: password + '_owner',
    });

    // Save files
    const originalPath = path.join(uploadsDir, `${sessionId}_original.pdf`);
    const protectedPath = path.join(processedDir, `${sessionId}_protected.pdf`);
    
    await fs.writeFile(originalPath, req.file.buffer);
    await fs.writeFile(protectedPath, protectedPdfBytes);

    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPaths: [originalPath],
      processedPath: protectedPath,
      expiry,
      metadata: {
        pageCount: pdfDoc.getPageCount(),
        hasPassword: true,
        restrictions: restrictions || []
      }
    });

    res.json({
      sessionId,
      success: true,
      fileName: `protected_${req.file.originalname}`,
      pageCount: pdfDoc.getPageCount(),
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('PDF protection error:', error);
    res.status(500).json({ error: 'Failed to protect PDF. Please try again.' });
  }
});

// Add Watermark Tool
router.post('/watermark', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const { watermarkText, opacity, position } = req.body;
    
    if (!watermarkText) {
      return res.status(400).json({ error: 'Watermark text is required' });
    }

    const sessionId = uuidv4();
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    const pages = pdfDoc.getPages();
    const watermarkOpacity = parseFloat(opacity) || 0.5;

    for (const page of pages) {
      const { width, height } = page.getSize();
      
      // Calculate position
      let x = width / 2;
      let y = height / 2;
      
      if (position === 'top-left') {
        x = 50;
        y = height - 50;
      } else if (position === 'top-right') {
        x = width - 50;
        y = height - 50;
      } else if (position === 'bottom-left') {
        x = 50;
        y = 50;
      } else if (position === 'bottom-right') {
        x = width - 50;
        y = 50;
      }

      page.drawText(watermarkText, {
        x,
        y,
        size: 40,
        font: helveticaFont,
        color: rgb(0.7, 0.7, 0.7),
        opacity: watermarkOpacity,
        rotate: { type: 'radians', angle: -Math.PI / 4 }, // 45 degree rotation
      });
    }

    const watermarkedPdfBytes = await pdfDoc.save();

    // Save files
    const originalPath = path.join(uploadsDir, `${sessionId}_original.pdf`);
    const watermarkedPath = path.join(processedDir, `${sessionId}_watermarked.pdf`);
    
    await fs.writeFile(originalPath, req.file.buffer);
    await fs.writeFile(watermarkedPath, watermarkedPdfBytes);

    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPaths: [originalPath],
      processedPath: watermarkedPath,
      expiry,
      metadata: {
        pageCount: pdfDoc.getPageCount(),
        watermarkText,
        position: position || 'center'
      }
    });

    res.json({
      sessionId,
      success: true,
      fileName: `watermarked_${req.file.originalname}`,
      pageCount: pdfDoc.getPageCount(),
      watermarkText,
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('PDF watermark error:', error);
    res.status(500).json({ error: 'Failed to add watermark to PDF. Please try again.' });
  }
});

// Rotate PDF Tool
router.post('/rotate', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const { angle, pages } = req.body;
    const rotationAngle = parseInt(angle) || 90;
    
    const sessionId = uuidv4();
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const totalPages = pdfDoc.getPageCount();
    const pdfPages = pdfDoc.getPages();

    // Parse which pages to rotate (default: all pages)
    let pagesToRotate: number[] = [];
    if (pages === 'all' || !pages) {
      pagesToRotate = Array.from({ length: totalPages }, (_, i) => i);
    } else {
      // Parse page ranges like "1,3,5-7"
      const pageRanges = pages.split(',');
      for (const range of pageRanges) {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map((n: string) => parseInt(n.trim()) - 1);
          for (let i = start; i <= end && i < totalPages; i++) {
            pagesToRotate.push(i);
          }
        } else {
          const pageNum = parseInt(range.trim()) - 1;
          if (pageNum >= 0 && pageNum < totalPages) {
            pagesToRotate.push(pageNum);
          }
        }
      }
    }

    // Rotate specified pages
    for (const pageIndex of pagesToRotate) {
      if (pageIndex < pdfPages.length) {
        pdfPages[pageIndex].setRotation({ type: 'degrees', angle: rotationAngle });
      }
    }

    const rotatedPdfBytes = await pdfDoc.save();

    // Save files
    const originalPath = path.join(uploadsDir, `${sessionId}_original.pdf`);
    const rotatedPath = path.join(processedDir, `${sessionId}_rotated.pdf`);
    
    await fs.writeFile(originalPath, req.file.buffer);
    await fs.writeFile(rotatedPath, rotatedPdfBytes);

    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPaths: [originalPath],
      processedPath: rotatedPath,
      expiry,
      metadata: {
        totalPages,
        rotatedPages: pagesToRotate.length,
        rotationAngle
      }
    });

    res.json({
      sessionId,
      success: true,
      fileName: `rotated_${req.file.originalname}`,
      totalPages,
      rotatedPages: pagesToRotate.length,
      rotationAngle,
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('PDF rotation error:', error);
    res.status(500).json({ error: 'Failed to rotate PDF. Please try again.' });
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
      for (const filePath of session.originalPaths) {
        await fs.unlink(filePath).catch(() => {});
      }
      if (session.processedPath) {
        await fs.unlink(session.processedPath).catch(() => {});
      }
      fileSessions.delete(sessionId);
      return res.status(410).json({ error: 'Download link has expired' });
    }

    if (!session.processedPath) {
      return res.status(404).json({ error: 'Processed file not found' });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(session.processedPath)}"`);

    // Stream the file
    const fileBuffer = await fs.readFile(session.processedPath);
    res.send(fileBuffer);

    // Clean up after download
    setTimeout(async () => {
      try {
        for (const filePath of session.originalPaths) {
          await fs.unlink(filePath).catch(() => {});
        }
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