import { PostDatabase } from "../../../types";
import { postCqrsRepository } from "../repository/posts-repository";
import { postQueryRepository } from "../repository/query-posts-repository";

export const postsService = {
  async createPost(bodyParams: PostDatabase): Promise<PostDatabase | null> {
    const post = {
      blogId: bodyParams.blogId,
      blogName: bodyParams.blogName,
      title: bodyParams.title,
      shortDescription: bodyParams.shortDescription,
      content: bodyParams.content,
      createdAt: new Date().toISOString(),
    };

    const resId = await postCqrsRepository.insertPost(post);
    if (resId) return await postQueryRepository.findPostById(resId.toString());
    return null;
  },

  async updatePost(bodyParams: PostDatabase): Promise<boolean> {
    const post = {
      id: bodyParams.id,
      blogId: bodyParams.blogId,
      blogName: bodyParams.blogName,
      title: bodyParams.title,
      shortDescription: bodyParams.shortDescription,
      content: bodyParams.content,
    };
    return await postCqrsRepository.updatePost(post);
  },

  async deletePost(id: string): Promise<boolean> {
    return await postCqrsRepository.deletePost(id);
  },
};
