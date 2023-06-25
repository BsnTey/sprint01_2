import { BlogDatabase } from "../../../types";
import { CreateBlogDto } from "../blog.dto";
import { blogCqrsRepository } from "../repository/blogs-repository";
import { blogQueryRepository } from "../repository/query-blogs-repository";

export const blogsService = {
  async createPost(body: CreateBlogDto): Promise<BlogDatabase | null> {
    const id = Date.now().toString();
    const data = {
      id,
      isMembership: false,
      ...body,
      createdAt: new Date().toISOString(),
    };

    const res = await blogCqrsRepository.insertBlog(data);
    if (res) return await blogQueryRepository.findBlogById(id);
    return null;
  },

  async updatePost(id: string, body: CreateBlogDto): Promise<boolean> {
    let data = await blogQueryRepository.findBlogById(id);
    if (!data) return false;
    data = {
      ...data,
      ...body,
    };
    return await blogCqrsRepository.updateBlog(data);
  },

  async deletePost(id: string): Promise<boolean> {
    let data = await blogQueryRepository.findBlogById(id);
    if (!data) return false;
    return await blogCqrsRepository.deleteBlog(id);
  },
};
