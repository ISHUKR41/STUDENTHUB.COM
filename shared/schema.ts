import { pgTable, text, serial, integer, boolean, timestamp, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const newsArticles = pgTable("news_articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  summary: text("summary").notNull(),
  fullContent: text("full_content").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // Academic, Exam, Scholarship, Career, Technology, Sports, General
  tags: json("tags").$type<string[]>().default([]),
  author: varchar("author", { length: 200 }),
  publishDate: timestamp("publish_date").notNull().defaultNow(),
  readTime: integer("read_time").default(5), // in minutes
  featured: boolean("featured").default(false),
  priority: integer("priority").default(3), // 1-5 for sorting
  images: json("images").$type<{url: string, alt: string, caption: string}[]>().default([]),
  pdfFile: text("pdf_file"), // path to original PDF
  sourceLink: text("source_link"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  shares: integer("shares").default(0),
  status: varchar("status", { length: 20 }).notNull().default("draft"), // draft, published, archived
  searchKeywords: json("search_keywords").$type<string[]>().default([]),
  studentLevel: varchar("student_level", { length: 20 }).default("all"), // school, college, graduate, all
  examRelevance: json("exam_relevance").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertNewsSchema = createInsertSchema(newsArticles);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsSchema>;
