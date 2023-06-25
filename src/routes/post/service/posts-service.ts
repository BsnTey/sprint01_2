import { PostDatabase } from "../../../types";
import { CreatePostDto } from "../post.dto";
import { postCqrsRepository } from "../repository/posts-repository";
import { postQueryRepository } from "../repository/query-posts-repository";

export const postsService = {
  async createPost(body: CreatePostDto): Promise<PostDatabase | null> {
    const id = Date.now().toString();
    const data = {
      ...body,
      id,
      blogName: "string",
      createdAt: new Date().toISOString(),
    };

    const res = await postCqrsRepository.insertPost(data);
    if (res) return await postQueryRepository.findPostById(id);
    return null;
  },

  async updatePost(id: string, body: CreatePostDto): Promise<boolean> {
    let data = await postQueryRepository.findPostById(id);
    if (!data) return false;
    data = {
      ...data,
      ...body,
    };
    return await postCqrsRepository.updatePost(data);
  },

  async deletePost(id: string): Promise<boolean> {
    let data = await postQueryRepository.findPostById(id);
    if (!data) return false;
    return await postCqrsRepository.deletePost(id);
  },
};
