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
