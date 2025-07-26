import type { Express } from "express";
import { storage } from "../storage";
import { newsArticles } from "../../shared/schema";
import { eq, desc, like, or } from "drizzle-orm";

export function registerNewsRoutes(app: Express) {
  // GET /api/news - Get paginated news with filters
  app.get("/api/news", async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 12, 
        category, 
        search, 
        status = 'published' 
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);
      
      let query = storage.db.select().from(newsArticles);
      
      // Add filters
      let whereConditions = [];
      
      if (status) {
        whereConditions.push(eq(newsArticles.status, status as string));
      }
      
      if (category && category !== 'All Categories') {
        whereConditions.push(eq(newsArticles.category, category as string));
      }
      
      if (search) {
        whereConditions.push(
          or(
            like(newsArticles.title, `%${search}%`),
            like(newsArticles.summary, `%${search}%`),
            like(newsArticles.fullContent, `%${search}%`)
          )
        );
      }
      
      // Apply conditions if any exist
      if (whereConditions.length > 0) {
        query = query.where(whereConditions.length === 1 ? whereConditions[0] : 
          whereConditions.reduce((acc, condition) => eq(acc, condition))
        );
      }
      
      const articles = await query
        .orderBy(desc(newsArticles.priority), desc(newsArticles.publishDate))
        .limit(Number(limit))
        .offset(offset);

      res.json({
        success: true,
        data: articles,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: articles.length
        }
      });
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch news articles'
      });
    }
  });

  // GET /api/news/:id - Get single news article
  app.get("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const article = await storage.db.select()
        .from(newsArticles)
        .where(eq(newsArticles.id, Number(id)))
        .limit(1);
      
      if (article.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Article not found'
        });
      }
      
      // Increment view count
      await storage.db.update(newsArticles)
        .set({ views: article[0].views + 1 })
        .where(eq(newsArticles.id, Number(id)));
      
      res.json({
        success: true,
        data: { ...article[0], views: article[0].views + 1 }
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch article'
      });
    }
  });

  // POST /api/news - Create new news article (admin only)
  app.post("/api/news", async (req, res) => {
    try {
      const articleData = req.body;
      
      const [newArticle] = await storage.db.insert(newsArticles)
        .values({
          ...articleData,
          publishDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      res.status(201).json({
        success: true,
        data: newArticle
      });
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create article'
      });
    }
  });

  // POST /api/news/bulk-upload - Bulk upload from PDF (admin only)
  app.post("/api/news/bulk-upload", async (req, res) => {
    try {
      const { articles } = req.body;
      
      if (!Array.isArray(articles)) {
        return res.status(400).json({
          success: false,
          error: 'Articles must be an array'
        });
      }
      
      const newArticles = await storage.db.insert(newsArticles)
        .values(articles.map(article => ({
          ...article,
          publishDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        })))
        .returning();
      
      res.status(201).json({
        success: true,
        data: newArticles,
        count: newArticles.length
      });
    } catch (error) {
      console.error('Error bulk uploading articles:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to bulk upload articles'
      });
    }
  });

  // GET /api/news/categories - Get all categories
  app.get("/api/news/categories", async (req, res) => {
    try {
      const categories = [
        'Academic',
        'Exam', 
        'Scholarship',
        'Career',
        'Technology',
        'Sports',
        'General'
      ];
      
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch categories'
      });
    }
  });

  // GET /api/news/featured - Get featured news
  app.get("/api/news/featured", async (req, res) => {
    try {
      const featuredArticles = await storage.db.select()
        .from(newsArticles)
        .where(eq(newsArticles.featured, true))
        .orderBy(desc(newsArticles.priority), desc(newsArticles.publishDate))
        .limit(5);
      
      res.json({
        success: true,
        data: featuredArticles
      });
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch featured articles'
      });
    }
  });

  // PUT /api/news/:id/like - Like an article
  app.put("/api/news/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      
      const article = await storage.db.select()
        .from(newsArticles)
        .where(eq(newsArticles.id, Number(id)))
        .limit(1);
      
      if (article.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Article not found'
        });
      }
      
      const updatedArticle = await storage.db.update(newsArticles)
        .set({ likes: article[0].likes + 1 })
        .where(eq(newsArticles.id, Number(id)))
        .returning();
      
      res.json({
        success: true,
        data: updatedArticle[0]
      });
    } catch (error) {
      console.error('Error liking article:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to like article'
      });
    }
  });
}