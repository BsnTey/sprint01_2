import { BlogDatabase } from "../../../types";
import { getBlogParamsFromReq } from "../../../utils";
import { CreateBlogDto } from "../blog.dto";
import { blogCqrsRepository } from "../repository/blogs-repository";
import { blogQueryRepository } from "../repository/query-blogs-repository";

export const blogsService = {
  async createBlog(bodyParams: CreateBlogDto): Promise<BlogDatabase | null> {
    const bodyParamsFilter = getBlogParamsFromReq(bodyParams);

    const id = Date.now().toString();
    const data = {
      ...bodyParamsFilter,
      id,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    const res = await blogCqrsRepository.insertBlog(data);
    if (res) return await blogQueryRepository.findBlogById(id);
    return null;
  },

  async updateBlog(id: string, bodyParams: CreateBlogDto): Promise<boolean> {
    let data = await blogQueryRepository.findBlogById(id);
    if (!data) return false;
    data = {
      ...data,
      ...bodyParams,
    };
    return await blogCqrsRepository.updateBlog(data);
  },

  async deleteBlog(id: string): Promise<boolean> {
    let data = await blogQueryRepository.findBlogById(id);
    if (!data) return false;
    return await blogCqrsRepository.deleteBlog(id);
  },
};
