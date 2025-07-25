import { spawn, ChildProcess } from 'child_process';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PythonBridge {
  private pythonProcess: ChildProcess | null = null;
  private isReady = false;

  constructor() {
    this.startPythonService();
  }

  private startPythonService() {
    const pythonScript = path.resolve('./server/start_python_service.py');
    
    console.log(`Starting Python service from: ${pythonScript}`);
    
    // Start Python Flask service on port 5001
    this.pythonProcess = spawn('python3', [pythonScript], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, PYTHONUNBUFFERED: '1' },
      cwd: process.cwd()
    });

    this.pythonProcess?.stdout?.on('data', (data) => {
      const output = data.toString();
      console.log(`[Python Service] ${output}`);
      if (output.includes('Running on')) {
        this.isReady = true;
      }
    });

    this.pythonProcess?.stderr?.on('data', (data) => {
      console.error(`[Python Service Error] ${data.toString()}`);
    });

    this.pythonProcess?.on('exit', (code) => {
      console.log(`Python service exited with code ${code}`);
      this.isReady = false;
      // Restart after delay
      setTimeout(() => this.startPythonService(), 5000);
    });
  }

  async proxyRequest(req: Request, res: Response, endpoint: string) {
    if (!this.isReady) {
      return res.status(503).json({
        success: false,
        error: 'PDF conversion service is not ready'
      });
    }

    try {
      const fetch = (await import('node-fetch')).default;
      const targetUrl = `http://localhost:5001${endpoint}`;
      
      let fetchOptions: any = {
        method: req.method,
        headers: {
          ...req.headers,
          host: 'localhost:5001'
        }
      };

      // Handle form data for file uploads
      if (req.method === 'POST' && req.files) {
        const FormData = (await import('form-data')).default;
        const formData = new FormData();
        
        // Add uploaded files
        Object.entries(req.files).forEach(([key, files]) => {
          const fileArray = Array.isArray(files) ? files : [files];
          fileArray.forEach(file => {
            if ('data' in file) {
              formData.append(key, file.data, file.name);
            }
          });
        });

        fetchOptions.body = formData;
        delete fetchOptions.headers['content-type']; // Let form-data set it
      } else if (req.method === 'POST' && req.body) {
        fetchOptions.body = JSON.stringify(req.body);
        fetchOptions.headers['content-type'] = 'application/json';
      }

      const response = await fetch(targetUrl, fetchOptions);
      const data = await response.json();
      
      res.status(response.status).json(data);
    } catch (error) {
      console.error('Python bridge error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async proxyDownload(req: Request, res: Response, downloadId: string) {
    if (!this.isReady) {
      return res.status(503).json({
        success: false,
        error: 'PDF conversion service is not ready'
      });
    }

    try {
      const fetch = (await import('node-fetch')).default;
      const targetUrl = `http://localhost:5001/api/pdf-converter/download/${downloadId}`;
      
      const response = await fetch(targetUrl);
      
      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json(errorData);
      }

      // Stream the file download
      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      const contentDisposition = response.headers.get('content-disposition') || 'attachment; filename="converted.docx"';
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', contentDisposition);
      
      response.body?.pipe(res);
    } catch (error) {
      console.error('Download proxy error:', error);
      res.status(500).json({
        success: false,
        error: 'Download failed'
      });
    }
  }

  shutdown() {
    if (this.pythonProcess) {
      this.pythonProcess.kill();
    }
  }
}

export const pythonBridge = new PythonBridge();

// Graceful shutdown
process.on('SIGINT', () => {
  pythonBridge.shutdown();
  process.exit(0);
});

process.on('SIGTERM', () => {
  pythonBridge.shutdown();
  process.exit(0);
});