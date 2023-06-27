import { BlogDatabase } from "../../../types";
import { getBlogParamsFromReq } from "../../../utils";
import { CreateBlogDto } from "../blog.dto";
import { blogCqrsRepository } from "../repository/blogs-repository";
import { blogQueryRepository } from "../repository/query-blogs-repository";

export const blogsService = {
  async createBlog(bodyParams: CreateBlogDto): Promise<BlogDatabase | null> {
    const bodyParamsFilter = getBlogParamsFromReq(bodyParams);

    const data = {
      ...bodyParamsFilter,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    const resId = await blogCqrsRepository.insertBlog(data);
    if (resId) return await blogQueryRepository.findBlogById(resId.toString());
    return null;
  },

  async updateBlog(id: string, bodyParams: CreateBlogDto): Promise<boolean> {
    const filterParams = getBlogParamsFromReq(bodyParams);
    let data = await blogQueryRepository.findBlogById(id);

    if (!data) return false;
    data = {
      ...data,
      ...filterParams,
    };
    return await blogCqrsRepository.updateBlog(data);
  },

  async deleteBlog(id: string): Promise<boolean> {
    let data = await blogQueryRepository.findBlogById(id);
    if (!data) return false;
    return await blogCqrsRepository.deleteBlog(id);
  },
};
