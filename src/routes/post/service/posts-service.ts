import { PostDatabase } from "../../../types";
import { getPostsParamsFromReq } from "../../../utils";
import { CreatePostDto } from "../post.dto";
import { postCqrsRepository } from "../repository/posts-repository";
import { postQueryRepository } from "../repository/query-posts-repository";

export const postsService = {
  async createPost(bodyParams: PostDatabase): Promise<PostDatabase | null> {
    const filterParams = getPostsParamsFromReq(bodyParams);

    const data = {
      ...filterParams,
      createdAt: new Date().toISOString(),
    };

    const res = await postCqrsRepository.insertPost(data);
    if (res) return await postQueryRepository.findPostById(bodyParams.id);
    return null;
  },

  async updatePost(bodyParams: PostDatabase): Promise<boolean> {
    const filterParams = getPostsParamsFromReq(bodyParams);
    return await postCqrsRepository.updatePost(filterParams);
  },

  async deletePost(id: string): Promise<boolean> {
    return await postCqrsRepository.deletePost(id);
  },
};
