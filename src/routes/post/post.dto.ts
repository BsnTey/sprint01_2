export interface CreatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
  createdAt: string;
}

// export type CreatePostPrepDto = CreatePostDto | { id: string; blogName: string };
