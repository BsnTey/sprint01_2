import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { blogsCollections } from "../../../setting";
import { BlogDatabase } from "../../../types";

export const blogCqrsRepository = {
  async insertBlog(blog: Partial<BlogDatabase>) {
    const result: InsertOneResult<BlogDatabase> = await blogsCollections.insertOne(blog as BlogDatabase);
    return result.insertedId;
  },

  async updateBlog(blog: Partial<BlogDatabase>) {
    const result: UpdateResult<BlogDatabase> = await blogsCollections.updateOne({ _id: new ObjectId(blog.id) }, { $set: blog });
    return result.matchedCount === 1;
  },

  async deleteBlog(id: string) {
    const result: DeleteResult = await blogsCollections.deleteOne({ _id: new ObjectId(id) });
    return result.acknowledged;
  },

  async deleteAll() {
    const result: DeleteResult = await blogsCollections.deleteMany({});
    return result.acknowledged;
  },
};
