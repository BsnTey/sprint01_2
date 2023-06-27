import { BlogDatabase } from "../../../types";
import { CreateBlogDto } from "../blog.dto";
import { blogCqrsRepository } from "../repository/blogs-repository";
import { blogQueryRepository } from "../repository/query-blogs-repository";

export const blogsService = {
  async createBlog(bodyParams: CreateBlogDto): Promise<BlogDatabase | null> {
    const blog = {
      name: bodyParams.name,
      description: bodyParams.description,
      websiteUrl: bodyParams.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    const resId = await blogCqrsRepository.insertBlog(blog);
    if (resId) return await blogQueryRepository.findBlogById(resId.toString());
    return null;
  },

  async updateBlog(id: string, bodyParams: CreateBlogDto): Promise<boolean> {
    let data = await blogQueryRepository.findBlogById(id);

    if (!data) return false;
    const blog = {
      ...data,
      name: bodyParams.name,
      description: bodyParams.description,
      websiteUrl: bodyParams.websiteUrl,
    };
    return await blogCqrsRepository.updateBlog(blog);
  },

  async deleteBlog(id: string): Promise<boolean> {
    let data = await blogQueryRepository.findBlogById(id);
    if (!data) return false;
    return await blogCqrsRepository.deleteBlog(id);
  },
};
