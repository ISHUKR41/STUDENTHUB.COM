import { users, type User, type InsertUser } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  db: ReturnType<typeof drizzle>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;
  public db: ReturnType<typeof drizzle>;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Initialize Drizzle database connection
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set");
    }
    
    const sql = neon(databaseUrl);
    this.db = drizzle(sql);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
