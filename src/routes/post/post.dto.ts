export interface CreatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  // не верно в swagger. это число
  blogId: number;
  createdAt: string;
}

// export type CreatePostPrepDto = CreatePostDto | { id: string; blogName: string };
