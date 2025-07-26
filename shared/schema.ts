import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const newsArticles = pgTable("news_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  summary: text("summary").notNull(),
  fullContent: text("full_content").notNull(),
  category: text("category").notNull(),
  tags: json("tags").$type<string[]>().default([]),
  author: text("author").notNull(),
  publishDate: timestamp("publish_date").notNull().defaultNow(),
  readTime: integer("read_time").notNull().default(5),
  featured: boolean("featured").notNull().default(false),
  priority: integer("priority").notNull().default(3),
  images: json("images").$type<Array<{url: string, alt: string, caption: string}>>().default([]),
  pdfFile: text("pdf_file"),
  sourceLink: text("source_link"),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  shares: integer("shares").notNull().default(0),
  status: text("status").notNull().default("published"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).pick({
  title: true,
  subtitle: true,
  summary: true,
  fullContent: true,
  category: true,
  tags: true,
  author: true,
  readTime: true,
  featured: true,
  priority: true,
  images: true,
  pdfFile: true,
  sourceLink: true,
  status: true,
});

export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;
