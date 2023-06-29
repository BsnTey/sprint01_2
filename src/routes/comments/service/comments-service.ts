import { CreateCommentImplUser } from "../comments.dto";
import { commentCqrsRepository } from "../repository/comments-repository";
import { commentQueryRepository } from "../repository/query-comments-repository";

export const commentsService = {
  async createComment(bodyParams: CreateCommentImplUser) {
    const comment = {
      content: bodyParams.content,
      commentatorInfo: {
        userId: bodyParams.user._id.toString(),
        userLogin: bodyParams.user.login,
      },
      createdAt: new Date().toISOString(),
    };

    const resId = await commentCqrsRepository.insertComment(comment);
    if (resId) return await commentQueryRepository.findCommentById(resId.toString());
    return null;
  },

  async updateComment(id: string, content: string): Promise<boolean> {
    return await commentCqrsRepository.updateComment(id, content);
  },

  async deleteComment(id: string): Promise<boolean> {
    return await commentCqrsRepository.deleteComment(id);
  },
};
