import { MongoClient, ServerApiVersion } from "mongodb";
import { uri_mongo } from "../constant";
import { BlogDatabase, PostDatabase } from "../types";

if (!uri_mongo) {
  throw new Error(`Invalid URI`);
}

export const client = new MongoClient(uri_mongo, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const db = client.db("article");

export async function run() {
  try {
    await client.connect();

    await client.db("article").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
  } catch {
    console.log("❌ Don't connected to MongoDB!");
    await client.close();
  }
}

export type WithId = {
  id: string;
  [key: string]: any;
};

export class DataBase<T extends WithId> {
  private db: T[];

  constructor() {
    this.db = [];
  }

  clearDB(): void {
    this.db = [];
  }

  deleteId(id: string): void {
    this.db = this.db.filter((blog: T) => blog.id !== id);
  }

  insert(blog: T): void {
    this.db.push(blog);
  }

  findOne(id: string): T | undefined {
    return this.db.find((blog) => blog.id === id);
  }

  replace(inputBlog: T) {
    let index = this.db.findIndex((blog: T) => blog.id === inputBlog.id);

    if (index !== -1) {
      this.db[index] = inputBlog;
    }
  }

  getAll() {
    return this.db;
  }
}
