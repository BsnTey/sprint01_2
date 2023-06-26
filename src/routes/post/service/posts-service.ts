import { PostDatabase } from "../../../types";
import { getPostsParamsFromReq } from "../../../utils";
import { CreatePostDto } from "../post.dto";
import { postCqrsRepository } from "../repository/posts-repository";
import { postQueryRepository } from "../repository/query-posts-repository";

export const postsService = {
  async createPost(bodyParams: CreatePostDto, blogName: string): Promise<PostDatabase | null> {
    const idPost = Date.now().toString();
    const bodyParamsMerge = getPostsParamsFromReq(idPost, bodyParams, blogName);

    const data = {
      ...bodyParamsMerge,
      createdAt: new Date().toISOString(),
    };

    const res = await postCqrsRepository.insertPost(data);
    if (res) return await postQueryRepository.findPostById(idPost);
    return null;
  },

  async updatePost(idPost: string, bodyParams: CreatePostDto, blogName: string): Promise<boolean> {
    const bodyParamsMerge = getPostsParamsFromReq(idPost, bodyParams, blogName);
    return await postCqrsRepository.updatePost(bodyParamsMerge);
  },

  async deletePost(id: string): Promise<boolean> {
    let data = await postQueryRepository.findPostById(id);
    if (!data) return false;
    return await postCqrsRepository.deletePost(id);
  },
};
