export interface CreatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
}

// export type CreatePostPrepDto = CreatePostDto | { id: string; blogName: string };
