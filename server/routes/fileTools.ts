import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'application/rtf'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, XLSX, PPTX, TXT, RTF files are allowed.'));
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

// Text to DOCX Converter
router.post('/text-to-docx', async (req, res) => {
  try {
    const { text, title, fontSize, fontFamily } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const sessionId = uuidv4();
    
    // Create Word document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: title || 'Document',
                bold: true,
                size: parseInt(fontSize) * 2 || 24
              })
            ]
          }),
          new Paragraph({
            children: [new TextRun({ text: '' })] // Empty line
          }),
          ...text.split('\n').map((line: string) => 
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  size: parseInt(fontSize) || 12
                })
              ]
            })
          )
        ]
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.join(processedDir, `${sessionId}_document.docx`);
    await fs.writeFile(outputPath, buffer);

    const expiry = new Date(Date.now() + 4 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPath: '',
      processedPath: outputPath,
      expiry,
      metadata: { wordCount: text.split(' ').length }
    });

    res.json({
      sessionId,
      success: true,
      fileName: `${title || 'document'}.docx`,
      wordCount: text.split(' ').length,
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('Text to DOCX error:', error);
    res.status(500).json({ error: 'Failed to convert text to Word document. Please try again.' });
  }
});

// DOCX to PDF Converter
router.post('/docx-to-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'DOCX file is required' });
    }

    const sessionId = uuidv4();
    
    // For a complete implementation, you would use a library like:
    // - libre-office-convert
    // - docx-pdf
    // - pandoc
    
    // For now, we'll create a simple PDF with extracted text
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    
    // Simple text extraction and PDF creation
    page.drawText('Document converted from DOCX', {
      x: 50,
      y: page.getHeight() - 100,
      size: 16
    });
    
    page.drawText('Note: Full DOCX to PDF conversion requires additional setup.', {
      x: 50,
      y: page.getHeight() - 130,
      size: 12
    });
    
    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join(processedDir, `${sessionId}_converted.pdf`);
    await fs.writeFile(outputPath, pdfBytes);

    const expiry = new Date(Date.now() + 4 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPath: '',
      processedPath: outputPath,
      expiry
    });

    res.json({
      sessionId,
      success: true,
      fileName: `converted_${req.file.originalname.replace('.docx', '.pdf')}`,
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('DOCX to PDF error:', error);
    res.status(500).json({ error: 'Failed to convert DOCX to PDF. Please try again.' });
  }
});

// Excel to PDF Converter
router.post('/excel-to-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Excel file is required' });
    }

    const sessionId = uuidv4();
    
    // Read Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;
    
    const pdfDoc = await PDFDocument.create();
    
    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      const page = pdfDoc.addPage();
      let yPosition = page.getHeight() - 50;
      
      // Add sheet title
      page.drawText(`Sheet: ${sheetName}`, {
        x: 50,
        y: yPosition,
        size: 16
      });
      yPosition -= 30;
      
      // Add data rows
      for (const row of jsonData.slice(0, 30)) { // Limit to 30 rows
        if (yPosition < 50) break;
        
        const rowText = (row as any[]).join(' | ');
        if (rowText.trim()) {
          page.drawText(rowText.substring(0, 80), {
            x: 50,
            y: yPosition,
            size: 10
          });
          yPosition -= 15;
        }
      }
    }
    
    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join(processedDir, `${sessionId}_excel.pdf`);
    await fs.writeFile(outputPath, pdfBytes);

    const expiry = new Date(Date.now() + 4 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPath: '',
      processedPath: outputPath,
      expiry,
      metadata: { sheets: sheetNames.length }
    });

    res.json({
      sessionId,
      success: true,
      fileName: `converted_${req.file.originalname.replace(/\.(xlsx|xls)$/, '.pdf')}`,
      sheets: sheetNames.length,
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('Excel to PDF error:', error);
    res.status(500).json({ error: 'Failed to convert Excel to PDF. Please try again.' });
  }
});

// Text File to PDF Converter
router.post('/txt-to-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Text file is required' });
    }

    const sessionId = uuidv4();
    const textContent = req.file.buffer.toString('utf-8');
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    const fontSize = 12;
    const margin = 50;
    const maxWidth = width - 2 * margin;
    
    // Split text into lines that fit the page
    const words = textContent.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      // Approximate width calculation
      if (testLine.length * fontSize * 0.6 <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
        }
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Draw text
    let yPosition = height - margin - fontSize;
    let currentPage = page;
    
    for (const line of lines) {
      if (yPosition < margin) {
        // Add new page if needed
        currentPage = pdfDoc.addPage();
        yPosition = currentPage.getHeight() - margin - fontSize;
      }
      
      currentPage.drawText(line, {
        x: margin,
        y: yPosition,
        size: fontSize
      });
      yPosition -= fontSize + 5;
    }

    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join(processedDir, `${sessionId}_text.pdf`);
    await fs.writeFile(outputPath, pdfBytes);

    const expiry = new Date(Date.now() + 4 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPath: '',
      processedPath: outputPath,
      expiry,
      metadata: { 
        wordCount: textContent.split(' ').length,
        pageCount: pdfDoc.getPageCount()
      }
    });

    res.json({
      sessionId,
      success: true,
      fileName: `converted_${req.file.originalname.replace('.txt', '.pdf')}`,
      wordCount: textContent.split(' ').length,
      pageCount: pdfDoc.getPageCount(),
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('TXT to PDF error:', error);
    res.status(500).json({ error: 'Failed to convert text file to PDF. Please try again.' });
  }
});

// Generic File Format Converter
router.post('/convert-format', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const { targetFormat } = req.body;
    if (!targetFormat) {
      return res.status(400).json({ error: 'Target format is required' });
    }

    const sessionId = uuidv4();
    const sourceExt = path.extname(req.file.originalname).toLowerCase();
    const targetExt = targetFormat.toLowerCase();

    // Handle specific conversions
    if (sourceExt === '.txt' && targetExt === 'pdf') {
      // Redirect to txt-to-pdf
      return router.handle(req, res, () => {});
    }

    // For demonstration, we'll create a simple conversion
    let outputBuffer: Buffer;
    let outputFileName: string;

    if (targetExt === 'txt') {
      // Convert to text (basic extraction)
      if (sourceExt === '.pdf') {
        outputBuffer = Buffer.from('PDF content extraction requires additional setup.');
      } else {
        outputBuffer = Buffer.from(req.file.buffer.toString('utf-8'));
      }
      outputFileName = `converted_${path.basename(req.file.originalname, sourceExt)}.txt`;
    } else {
      // For other formats, return original file with new extension (placeholder)
      outputBuffer = req.file.buffer;
      outputFileName = `converted_${path.basename(req.file.originalname, sourceExt)}.${targetExt}`;
    }

    const outputPath = path.join(processedDir, `${sessionId}_${outputFileName}`);
    await fs.writeFile(outputPath, outputBuffer);

    const expiry = new Date(Date.now() + 4 * 60 * 1000);
    fileSessions.set(sessionId, {
      originalPath: '',
      processedPath: outputPath,
      expiry,
      metadata: { 
        sourceFormat: sourceExt,
        targetFormat: targetExt,
        originalSize: req.file.size,
        convertedSize: outputBuffer.length
      }
    });

    res.json({
      sessionId,
      success: true,
      fileName: outputFileName,
      sourceFormat: sourceExt,
      targetFormat: targetExt,
      originalSize: req.file.size,
      convertedSize: outputBuffer.length,
      expiresAt: expiry.toISOString()
    });

  } catch (error) {
    console.error('Format conversion error:', error);
    res.status(500).json({ error: 'Failed to convert file format. Please try again.' });
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
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case '.xlsx':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case '.txt':
        contentType = 'text/plain';
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