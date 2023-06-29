import { UserDatabase } from "../../types";

export interface CreateCommentDto {
  content: string;
}

export interface CreateCommentImplUser extends CreateCommentDto {
  user: UserDatabase;
  postId: string;
}
