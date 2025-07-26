import { Request, Response } from "express";
import { newsArticles, insertNewsArticleSchema } from "../../shared/schema";
import { eq, desc, like, and, sql } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const connection = neon(process.env.DATABASE_URL!);
const db = drizzle(connection);

// Get paginated news with filters
export async function getNews(req: Request, res: Response) {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      search, 
      featured,
      status = 'published' 
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    let whereConditions = [eq(newsArticles.status, status as string)];
    
    if (category) {
      whereConditions.push(eq(newsArticles.category, category as string));
    }
    
    if (search) {
      whereConditions.push(
        sql`(${newsArticles.title} ILIKE ${`%${search}%`} OR ${newsArticles.summary} ILIKE ${`%${search}%`} OR ${newsArticles.fullContent} ILIKE ${`%${search}%`} OR ${newsArticles.author} ILIKE ${`%${search}%`})`
      );
    }
    
    if (featured === 'true') {
      whereConditions.push(eq(newsArticles.featured, true));
    }

    const articles = await db
      .select()
      .from(newsArticles)
      .where(and(...whereConditions))
      .orderBy(desc(newsArticles.priority), desc(newsArticles.publishDate))
      .limit(Number(limit))
      .offset(offset);

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(newsArticles)
      .where(and(...whereConditions));

    res.json({
      articles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount[0].count,
        totalPages: Math.ceil(totalCount[0].count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news articles' });
  }
}

// Get single news article
export async function getNewsById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const article = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.id, Number(id)))
      .limit(1);

    if (!article.length) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment view count
    await db
      .update(newsArticles)
      .set({ 
        views: sql`${newsArticles.views} + 1`,
        updatedAt: new Date()
      })
      .where(eq(newsArticles.id, Number(id)));

    res.json(article[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
}

// Create new news article
export async function createNews(req: Request, res: Response) {
  try {
    const validatedData = insertNewsArticleSchema.parse(req.body);
    
    const newArticle = await db
      .insert(newsArticles)
      .values([validatedData])
      .returning();

    res.status(201).json(newArticle[0]);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(400).json({ error: 'Failed to create article', details: error });
  }
}

// Update news article
export async function updateNews(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = insertNewsArticleSchema.partial().parse(req.body);
    
    const updatedArticle = await db
      .update(newsArticles)
      .set({ 
        ...validatedData, 
        updatedAt: new Date(),
        tags: validatedData.tags ? validatedData.tags : undefined,
        images: validatedData.images ? validatedData.images : undefined
      })
      .where(eq(newsArticles.id, Number(id)))
      .returning();

    if (!updatedArticle.length) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(updatedArticle[0]);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(400).json({ error: 'Failed to update article' });
  }
}

// Delete news article
export async function deleteNews(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const deletedArticle = await db
      .delete(newsArticles)
      .where(eq(newsArticles.id, Number(id)))
      .returning();

    if (!deletedArticle.length) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
}

// Get news by category
export async function getNewsByCategory(req: Request, res: Response) {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const articles = await db
      .select()
      .from(newsArticles)
      .where(and(
        eq(newsArticles.category, category),
        eq(newsArticles.status, 'published')
      ))
      .orderBy(desc(newsArticles.publishDate))
      .limit(Number(limit));

    res.json(articles);
  } catch (error) {
    console.error('Error fetching category news:', error);
    res.status(500).json({ error: 'Failed to fetch category news' });
  }
}

// Get trending news
export async function getTrendingNews(req: Request, res: Response) {
  try {
    const { limit = 10 } = req.query;

    const articles = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.status, 'published'))
      .orderBy(desc(newsArticles.views), desc(newsArticles.likes))
      .limit(Number(limit));

    res.json(articles);
  } catch (error) {
    console.error('Error fetching trending news:', error);
    res.status(500).json({ error: 'Failed to fetch trending news' });
  }
}

// Increment view count
export async function incrementViews(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    await db
      .update(newsArticles)
      .set({ 
        views: sql`${newsArticles.views} + 1`,
        updatedAt: new Date()
      })
      .where(eq(newsArticles.id, Number(id)));

    res.json({ message: 'View count updated' });
  } catch (error) {
    console.error('Error updating views:', error);
    res.status(500).json({ error: 'Failed to update views' });
  }
}

// Bulk upload from PDF
export async function bulkCreateNews(req: Request, res: Response) {
  try {
    const { articles } = req.body;
    
    if (!Array.isArray(articles)) {
      return res.status(400).json({ error: 'Articles must be an array' });
    }

    const validatedArticles = articles.map(article => 
      insertNewsArticleSchema.parse(article)
    );

    const createdArticles = await db
      .insert(newsArticles)
      .values(validatedArticles.map(article => ({
        ...article,
        tags: article.tags || [],
        images: article.images || []
      })))
      .returning();

    res.status(201).json({
      message: `Successfully created ${createdArticles.length} articles`,
      articles: createdArticles
    });
  } catch (error) {
    console.error('Error bulk creating articles:', error);
    res.status(400).json({ error: 'Failed to bulk create articles', details: error });
  }
}