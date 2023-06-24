import { DeleteResult, InsertOneResult, UpdateResult } from "mongodb";
import { blogsCollections } from "../../setting";
import { BlogDatabase } from "../../types";

export const blogRepository = {
  async findAllBlogs() {
    return await blogsCollections.find({}, { projection: { _id: 0 } }).toArray();
  },

  async findBlogById(id: string) {
    const blog: BlogDatabase | null = await blogsCollections.findOne({ id: { $eq: id } }, { projection: { _id: 0 } });
    if (blog) {
      return blog;
    } else {
      return null;
    }
  },

  async insertBlog(blog: Partial<BlogDatabase>) {
    const result: InsertOneResult<BlogDatabase> = await blogsCollections.insertOne(blog as BlogDatabase);
    return result.acknowledged;
  },

  async updateBlog(blog: Partial<BlogDatabase>) {
    const result: UpdateResult<BlogDatabase> = await blogsCollections.updateOne({ id: blog.id }, { $set: blog });
    return result.matchedCount === 1;
  },

  async deleteBlog(id: string) {
    const result: DeleteResult = await blogsCollections.deleteOne({ id });
    return result.acknowledged;
  },

  async deleteAll() {
    const result: DeleteResult = await blogsCollections.deleteMany({});
    return result.acknowledged;
  },
};
