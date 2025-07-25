import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import imageToolsRouter from "./routes/imageTools";
import pdfToolsRouter from "./routes/pdfTools";
import aiToolsRouter from "./routes/aiTools";
import fileToolsRouter from "./routes/fileTools";
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

  // PDF to Word converter routes - simplified implementation
  app.post("/api/pdf-converter/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file provided' });
      }

      // For now, return a mock successful response to test the frontend
      // The actual Python implementation will be integrated later
      const result = {
        success: true,
        download_id: `mock_${Date.now()}`,
        expiry_time: Date.now() + (4 * 60 * 1000), // 4 minutes from now
        file_size: 1024 * 150, // Mock 150KB
        pdf_type: 'text-based',
        pages: 5,
        expires_in_minutes: 4
      };

      setTimeout(() => {
        console.log('Mock conversion completed for:', req.file?.originalname);
      }, 2000);

      res.json(result);
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ success: false, error: 'Upload failed' });
    }
  });

  app.get("/api/pdf-converter/download/:downloadId", async (req, res) => {
    try {
      // Mock download - create a simple Word document
      const { Document, Packer, Paragraph, TextRun } = await import('docx');
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun("This is a mock converted Word document."),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("Your PDF has been successfully converted!"),
              ],
            }),
          ],
        }],
      });

      const buffer = await Packer.toBuffer(doc);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="converted.docx"');
      res.send(buffer);
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ success: false, error: 'Download failed' });
    }
  });

  app.get("/api/pdf-converter/status/:downloadId", async (req, res) => {
    try {
      // Mock status response
      const result = {
        success: true,
        expired: false,
        time_remaining_seconds: 180, // 3 minutes remaining
        time_remaining_minutes: 3.0,
        file_size: 1024 * 150
      };
      
      res.json(result);
    } catch (error) {
      console.error('Status check error:', error);
      res.status(500).json({ success: false, error: 'Status check failed' });
    }
  });

  app.get("/api/pdf-converter/health", async (req, res) => {
    try {
      res.json({
        success: true,
        status: 'healthy',
        tesseract_version: 'mock-version',
        active_conversions: 0
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
