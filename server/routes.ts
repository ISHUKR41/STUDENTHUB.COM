import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import imageToolsRouter from "./routes/imageTools";
import pdfToolsRouter from "./routes/pdfTools";
import aiToolsRouter from "./routes/aiTools";
import fileToolsRouter from "./routes/fileTools";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all tool routes with /api prefix
  app.use("/api/image-tools", imageToolsRouter);
  app.use("/api/pdf-tools", pdfToolsRouter);
  app.use("/api/ai-tools", aiToolsRouter);
  app.use("/api/file-tools", fileToolsRouter);

  const httpServer = createServer(app);

  return httpServer;
}
