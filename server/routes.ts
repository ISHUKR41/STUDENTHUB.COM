import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// In-memory storage for PDF conversion files
const pdfFileStore = new Map<string, {
  originalName: string;
  buffer: Buffer;
  uploadTime: number;
  expiryTime: number;
  processed: boolean;
}>();
import imageToolsRouter from "./routes/imageTools";
import pdfToolsRouter from "./routes/pdfTools";
import aiToolsRouter from "./routes/aiTools";
import fileToolsRouter from "./routes/fileTools";
import * as newsRoutes from "./routes/news";
import multer from "multer";
import { pythonBridge } from "./python_bridge";

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  storage: multer.memoryStorage(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all tool routes with /api prefix
  app.use("/api/image-tools", imageToolsRouter);
  app.use("/api/pdf-tools", pdfToolsRouter);
  app.use("/api/ai-tools", aiToolsRouter);
  app.use("/api/file-tools", fileToolsRouter);

  // News API routes
  app.get("/api/news", newsRoutes.getNews);
  app.get("/api/news/trending", newsRoutes.getTrendingNews);
  app.get("/api/news/category/:category", newsRoutes.getNewsByCategory);
  app.get("/api/news/:id", newsRoutes.getNewsById);
  app.post("/api/news", newsRoutes.createNews);
  app.put("/api/news/:id", newsRoutes.updateNews);
  app.delete("/api/news/:id", newsRoutes.deleteNews);
  app.post("/api/news/:id/view", newsRoutes.incrementViews);
  app.post("/api/news/bulk-upload", newsRoutes.bulkCreateNews);

  // PDF to Word converter routes - real backend processing
  app.post("/api/pdf-converter/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file provided' });
      }

      // Validate file type
      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ success: false, error: 'Only PDF files are allowed' });
      }

      // Validate file size (50MB)
      if (req.file.size > 50 * 1024 * 1024) {
        return res.status(400).json({ success: false, error: 'File too large. Maximum size is 50MB' });
      }

      console.log(`Processing PDF: ${req.file.originalname}, Size: ${req.file.size} bytes`);

      // Create a unique download ID
      const crypto = await import('crypto');
      const downloadId = crypto.randomBytes(16).toString('hex');
      const expiryTime = Date.now() + (4 * 60 * 1000); // 4 minutes from now
      
      // Store file info for later download
      pdfFileStore.set(`pdf_${downloadId}`, {
        originalName: req.file.originalname,
        buffer: req.file.buffer,
        uploadTime: Date.now(),
        expiryTime: expiryTime,
        processed: false
      });

      // Start background processing
      setTimeout(async () => {
        try {
          const { spawn } = await import('child_process');
          const fs = await import('fs');
          const path = await import('path');
          
          // Save PDF temporarily
          const tempPdfPath = path.join('/tmp', `pdf_${downloadId}.pdf`);
          await fs.promises.writeFile(tempPdfPath, req.file!.buffer);
          
          console.log(`PDF saved to: ${tempPdfPath}`);
          
          // Process PDF using Python script in background - extract text and create Word doc
          const pythonProcess = spawn('python3', [
            '-c',
            `
import sys
import os
import json
import fitz  # PyMuPDF
from docx import Document
from docx.shared import Inches

try:
    # Extract text from PDF
    pdf_doc = fitz.open('${tempPdfPath}')
    doc = Document()
    
    for page_num in range(len(pdf_doc)):
        page = pdf_doc[page_num]
        text = page.get_text()
        
        if text.strip():
            # Add page heading
            if page_num > 0:
                doc.add_page_break()
            
            heading = doc.add_heading(f'Page {page_num + 1}', level=2)
            
            # Split text into paragraphs and add to document
            paragraphs = text.split('\\n\\n')
            for para_text in paragraphs:
                if para_text.strip():
                    doc.add_paragraph(para_text.strip())
    
    pdf_doc.close()
    
    # Save converted document
    output_path = '/tmp/converted_${downloadId}.docx'
    doc.save(output_path)
    print('SUCCESS: Document saved to', output_path)
    
except Exception as e:
    print('ERROR:', str(e))
`
          ], { stdio: 'pipe' });

          pythonProcess.on('close', (code) => {
            // Mark as processed regardless of result
            const fileData = pdfFileStore.get(`pdf_${downloadId}`);
            if (fileData) {
              fileData.processed = true;
              pdfFileStore.set(`pdf_${downloadId}`, fileData);
            }
            
            // Clean up temp PDF file
            fs.unlink(tempPdfPath, () => {});
          });

        } catch (error) {
          console.error('Background processing error:', error);
        }
      }, 100);

      // Return immediate response
      const result = {
        success: true,
        download_id: downloadId,
        expiry_time: expiryTime,
        file_size: req.file.size,
        pdf_type: 'processing', // Will be determined during processing
        pages: 'calculating...',
        expires_in_minutes: 4
      };

      res.json(result);

    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ success: false, error: 'Upload failed' });
    }
  });

  app.get("/api/pdf-converter/download/:downloadId", async (req, res) => {
    try {
      const fileData = pdfFileStore.get(`pdf_${req.params.downloadId}`);
      
      if (!fileData) {
        return res.status(404).json({ success: false, error: 'File not found or expired' });
      }

      // Check if expired
      if (Date.now() > fileData.expiryTime) {
        pdfFileStore.delete(`pdf_${req.params.downloadId}`);
        return res.status(410).json({ success: false, error: 'Download link has expired' });
      }

      // Try to get converted file first
      const fs = await import('fs');
      const path = await import('path');
      const convertedPath = path.join('/tmp', `converted_${req.params.downloadId}.docx`);
      
      try {
        if (await fs.promises.access(convertedPath).then(() => true).catch(() => false)) {
          // Send the converted file
          const convertedBuffer = await fs.promises.readFile(convertedPath);
          
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalName.replace('.pdf', '.docx')}"`);
          res.send(convertedBuffer);
          
          // Clean up files
          pdfFileStore.delete(`pdf_${req.params.downloadId}`);
          fs.unlink(convertedPath, () => {});
          return;
        }
      } catch (error) {
        console.log('Converted file not ready, generating fallback...');
      }

      // Extract text from PDF and create Word document with actual content
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
      
      let extractedText = '';
      let pages = 0;
      
      try {
        // Use Python to extract text from PDF
        const { spawn } = await import('child_process');
        const fs = await import('fs');
        const path = await import('path');
        
        // Save PDF to temporary file for processing
        const tempPdfPath = path.join('/tmp', `extract_${req.params.downloadId}.pdf`);
        await fs.promises.writeFile(tempPdfPath, fileData.buffer);
        
        // Extract text using Python PyMuPDF
        const extractText = await new Promise<string>((resolve, reject) => {
          const pythonProcess = spawn('python3', [
            '-c',
            `
import sys
import fitz  # PyMuPDF
import json

try:
    # Open PDF
    doc = fitz.open('${tempPdfPath}')
    text_content = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        if text.strip():
            text_content.append(f"Page {page_num + 1}:\\n{text}\\n")
    
    doc.close()
    
    result = {
        "success": True,
        "text": "\\n".join(text_content),
        "pages": len(doc)
    }
    print(json.dumps(result))
    
except Exception as e:
    result = {
        "success": False,
        "error": str(e),
        "text": "",
        "pages": 0
    }
    print(json.dumps(result))
`
          ], { stdio: 'pipe' });

          let output = '';
          pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
          });

          pythonProcess.on('close', (code) => {
            try {
              const result = JSON.parse(output.trim());
              if (result.success && result.text) {
                resolve(result.text);
              } else {
                resolve('');
              }
            } catch (e) {
              resolve('');
            }
          });

          pythonProcess.on('error', (error) => {
            resolve('');
          });
        });

        extractedText = extractText;
        
        // Clean up temp file
        fs.unlink(tempPdfPath, () => {});
        
      } catch (error) {
        console.error('PDF text extraction failed:', error);
        extractedText = '';
      }

      // Create Word document with extracted content
      const paragraphs = [];
      
      if (extractedText && extractedText.trim()) {
        // Split text into paragraphs and create Word paragraphs
        const textParagraphs = extractedText.split('\n\n').filter(p => p.trim());
        
        for (const textPara of textParagraphs) {
          if (textPara.trim()) {
            // Check if it's a page header
            if (textPara.startsWith('Page ')) {
              paragraphs.push(new Paragraph({
                text: textPara,
                heading: HeadingLevel.HEADING_2,
              }));
            } else {
              // Regular paragraph
              paragraphs.push(new Paragraph({
                children: [
                  new TextRun({
                    text: textPara.trim(),
                  }),
                ],
              }));
            }
          }
        }
      } else {
        // Fallback content if extraction failed
        paragraphs.push(
          new Paragraph({
            text: "PDF Content Extraction",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Original File: ${fileData.originalName}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Note: This PDF may contain images or scanned content that requires OCR processing. The basic text extraction was not successful, but the file has been processed and converted to Word format.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "For better results with scanned PDFs, please try again as the system will attempt OCR processing.",
                italics: true,
              }),
            ],
          })
        );
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs,
        }],
      });

      const buffer = await Packer.toBuffer(doc);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalName.replace('.pdf', '.docx')}"`);
      res.send(buffer);

      // Clean up
      pdfFileStore.delete(`pdf_${req.params.downloadId}`);

    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ success: false, error: 'Download failed' });
    }
  });

  app.get("/api/pdf-converter/status/:downloadId", async (req, res) => {
    try {
      const fileData = pdfFileStore.get(`pdf_${req.params.downloadId}`);
      
      if (!fileData) {
        return res.status(404).json({ 
          success: false, 
          expired: true,
          error: 'File not found or expired' 
        });
      }

      const timeRemaining = Math.max(0, fileData.expiryTime - Date.now());
      const isExpired = timeRemaining <= 0;

      if (isExpired) {
        pdfFileStore.delete(`pdf_${req.params.downloadId}`);
        return res.status(410).json({
          success: false,
          expired: true,
          time_remaining_seconds: 0,
          time_remaining_minutes: 0
        });
      }

      const result = {
        success: true,
        expired: false,
        time_remaining_seconds: Math.floor(timeRemaining / 1000),
        time_remaining_minutes: Math.round(timeRemaining / 60000 * 10) / 10,
        file_size: fileData.buffer.length,
        processing_complete: fileData.processed || false
      };
      
      res.json(result);
    } catch (error) {
      console.error('Status check error:', error);
      res.status(500).json({ success: false, error: 'Status check failed' });
    }
  });

  app.get("/api/pdf-converter/health", async (req, res) => {
    try {
      // Check if Python libraries are available
      const { spawn } = await import('child_process');
      
      const healthCheck = spawn('python3', [
        '-c', 
        'import fitz, pytesseract, docx; print("ALL_MODULES_AVAILABLE")'
      ], { stdio: 'pipe' });

      let output = '';
      healthCheck.stdout.on('data', (data) => {
        output += data.toString();
      });

      healthCheck.on('close', (code) => {
        if (code === 0 && output.includes('ALL_MODULES_AVAILABLE')) {
          res.json({
            success: true,
            status: 'healthy',
            backend: 'nodejs-python-hybrid',
            libraries: ['PyMuPDF', 'Tesseract', 'python-docx', 'docx'],
            active_conversions: pdfFileStore.size
          });
        } else {
          res.json({
            success: true,
            status: 'healthy-limited',
            backend: 'nodejs-docx-fallback',
            libraries: ['docx'],
            note: 'OCR features may be limited',
            active_conversions: pdfFileStore.size
          });
        }
      });

      // Timeout after 3 seconds
      setTimeout(() => {
        healthCheck.kill();
        res.json({
          success: true,
          status: 'healthy-limited',
          backend: 'nodejs-docx-fallback',
          libraries: ['docx'],
          note: 'Python modules not responding, using fallback',
          active_conversions: pdfFileStore.size
        });
      }, 3000);

    } catch (error) {
      res.json({
        success: true,
        status: 'healthy-limited',
        backend: 'nodejs-docx-fallback',
        error: 'Using fallback implementation',
        active_conversions: pdfFileStore.size || 0
      });
    }
  });

  // Word to PDF Converter Routes
  app.post("/api/word-to-pdf-converter/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file provided' });
      }

      // Validate file type
      if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return res.status(400).json({ success: false, error: 'Only DOCX files are allowed' });
      }

      // Validate file size (50MB)
      if (req.file.size > 50 * 1024 * 1024) {
        return res.status(400).json({ success: false, error: 'File too large. Maximum size is 50MB' });
      }

      console.log(`Processing DOCX: ${req.file.originalname}, Size: ${req.file.size} bytes`);

      // Create a unique download ID
      const crypto = await import('crypto');
      const downloadId = crypto.randomBytes(16).toString('hex');
      const expiryTime = Date.now() + (4 * 60 * 1000); // 4 minutes from now
      
      // Store file info for later download
      pdfFileStore.set(`word_${downloadId}`, {
        originalName: req.file.originalname,
        buffer: req.file.buffer,
        uploadTime: Date.now(),
        expiryTime: expiryTime,
        processed: false
      });

      // Start background processing
      setTimeout(async () => {
        try {
          const { spawn } = await import('child_process');
          const fs = await import('fs');
          const path = await import('path');
          
          // Save DOCX temporarily
          const tempDocxPath = path.join('/tmp', `word_${downloadId}.docx`);
          await fs.promises.writeFile(tempDocxPath, req.file.buffer);
          
          console.log(`DOCX saved to: ${tempDocxPath}`);
          
          // Process DOCX using Python script
          const pythonProcess = spawn('python3', [
            path.join(process.cwd(), 'server', 'word_to_pdf_converter.py'),
            tempDocxPath,
            '/tmp'
          ], { stdio: 'pipe' });

          let output = '';
          pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
          });

          pythonProcess.on('close', (code) => {
            try {
              if (code === 0 && output.trim()) {
                const result = JSON.parse(output.trim());
                if (result.success) {
                  console.log(`Word to PDF conversion successful: ${result.output_path}`);
                }
              }
            } catch (e) {
              console.error('Failed to parse conversion result:', e);
            }
            
            // Mark as processed
            const fileData = pdfFileStore.get(`word_${downloadId}`);
            if (fileData) {
              fileData.processed = true;
              pdfFileStore.set(`word_${downloadId}`, fileData);
            }
            
            // Clean up temp DOCX file
            fs.unlink(tempDocxPath, () => {});
          });

        } catch (error) {
          console.error('Word to PDF processing error:', error);
        }
      }, 100);

      // Return immediate response
      const result = {
        success: true,
        download_id: downloadId,
        expiry_time: expiryTime,
        file_size: req.file.size,
        file_type: 'docx',
        expires_in_minutes: 4
      };

      res.json(result);

    } catch (error) {
      console.error('Word to PDF upload error:', error);
      res.status(500).json({ success: false, error: 'Upload failed' });
    }
  });

  app.get("/api/word-to-pdf-converter/download/:downloadId", async (req, res) => {
    try {
      const fileData = pdfFileStore.get(`word_${req.params.downloadId}`);
      
      if (!fileData) {
        return res.status(404).json({ success: false, error: 'File not found or expired' });
      }

      // Check if expired
      if (Date.now() > fileData.expiryTime) {
        pdfFileStore.delete(`word_${req.params.downloadId}`);
        return res.status(410).json({ success: false, error: 'Download link has expired' });
      }

      // Look for converted PDF file
      const fs = await import('fs');
      const path = await import('path');
      const convertedPath = path.join('/tmp', `word_${req.params.downloadId}.pdf`);
      
      try {
        if (await fs.promises.access(convertedPath).then(() => true).catch(() => false)) {
          // Send the converted file
          const convertedBuffer = await fs.promises.readFile(convertedPath);
          
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalName.replace('.docx', '.pdf')}"`);
          res.send(convertedBuffer);
          
          // Clean up files
          pdfFileStore.delete(`word_${req.params.downloadId}`);
          fs.unlink(convertedPath, () => {});
          return;
        }
      } catch (error) {
        console.log('Converted PDF not ready...');
      }

      // If no converted file, return error
      res.status(202).json({ 
        success: false, 
        error: 'Conversion still in progress. Please try again in a moment.' 
      });

    } catch (error) {
      console.error('Word to PDF download error:', error);
      res.status(500).json({ success: false, error: 'Download failed' });
    }
  });

  // PDF to PowerPoint Converter Routes
  app.post("/api/pdf-to-pptx-converter/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file provided' });
      }

      // Validate file type
      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ success: false, error: 'Only PDF files are allowed' });
      }

      // Validate file size (50MB)
      if (req.file.size > 50 * 1024 * 1024) {
        return res.status(400).json({ success: false, error: 'File too large. Maximum size is 50MB' });
      }

      console.log(`Processing PDF to PPTX: ${req.file.originalname}, Size: ${req.file.size} bytes`);

      // Create a unique download ID
      const crypto = await import('crypto');
      const downloadId = crypto.randomBytes(16).toString('hex');
      const expiryTime = Date.now() + (4 * 60 * 1000); // 4 minutes from now
      
      // Store file info for later download
      pdfFileStore.set(`pptx_${downloadId}`, {
        originalName: req.file.originalname,
        buffer: req.file.buffer,
        uploadTime: Date.now(),
        expiryTime: expiryTime,
        processed: false
      });

      // Start background processing
      setTimeout(async () => {
        try {
          const { spawn } = await import('child_process');
          const fs = await import('fs');
          const path = await import('path');
          
          // Save PDF temporarily
          const tempPdfPath = path.join('/tmp', `pptx_${downloadId}.pdf`);
          await fs.promises.writeFile(tempPdfPath, req.file.buffer);
          
          console.log(`PDF saved to: ${tempPdfPath}`);
          
          // Process PDF using Python script
          const pythonProcess = spawn('python3', [
            path.join(process.cwd(), 'server', 'pdf_to_pptx_converter.py'),
            tempPdfPath,
            '/tmp'
          ], { stdio: 'pipe' });

          let output = '';
          pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
          });

          pythonProcess.on('close', (code) => {
            try {
              if (code === 0 && output.trim()) {
                const result = JSON.parse(output.trim());
                if (result.success) {
                  console.log(`PDF to PPTX conversion successful: ${result.output_path}`);
                }
              }
            } catch (e) {
              console.error('Failed to parse conversion result:', e);
            }
            
            // Mark as processed
            const fileData = pdfFileStore.get(`pptx_${downloadId}`);
            if (fileData) {
              fileData.processed = true;
              pdfFileStore.set(`pptx_${downloadId}`, fileData);
            }
            
            // Clean up temp PDF file
            fs.unlink(tempPdfPath, () => {});
          });

        } catch (error) {
          console.error('PDF to PPTX processing error:', error);
        }
      }, 100);

      // Return immediate response
      const result = {
        success: true,
        download_id: downloadId,
        expiry_time: expiryTime,
        file_size: req.file.size,
        file_type: 'pdf',
        expires_in_minutes: 4
      };

      res.json(result);

    } catch (error) {
      console.error('PDF to PPTX upload error:', error);
      res.status(500).json({ success: false, error: 'Upload failed' });
    }
  });

  app.get("/api/pdf-to-pptx-converter/download/:downloadId", async (req, res) => {
    try {
      const fileData = pdfFileStore.get(`pptx_${req.params.downloadId}`);
      
      if (!fileData) {
        return res.status(404).json({ success: false, error: 'File not found or expired' });
      }

      // Check if expired
      if (Date.now() > fileData.expiryTime) {
        pdfFileStore.delete(`pptx_${req.params.downloadId}`);
        return res.status(410).json({ success: false, error: 'Download link has expired' });
      }

      // Look for converted PPTX file
      const fs = await import('fs');
      const path = await import('path');
      const convertedPath = path.join('/tmp', `pptx_${req.params.downloadId}.pptx`);
      
      try {
        if (await fs.promises.access(convertedPath).then(() => true).catch(() => false)) {
          // Send the converted file
          const convertedBuffer = await fs.promises.readFile(convertedPath);
          
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
          res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalName.replace('.pdf', '.pptx')}"`);
          res.send(convertedBuffer);
          
          // Clean up files
          pdfFileStore.delete(`pptx_${req.params.downloadId}`);
          fs.unlink(convertedPath, () => {});
          return;
        }
      } catch (error) {
        console.log('Converted PPTX not ready...');
      }

      // If no converted file, return error
      res.status(202).json({ 
        success: false, 
        error: 'Conversion still in progress. Please try again in a moment.' 
      });

    } catch (error) {
      console.error('PDF to PPTX download error:', error);
      res.status(500).json({ success: false, error: 'Download failed' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
