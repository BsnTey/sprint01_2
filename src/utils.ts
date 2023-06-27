import { CreateBlogDto } from "./routes/blog/blog.dto";
import { CreatePostDto } from "./routes/post/post.dto";
import { PostDatabase, QueryParams, QueryParamsWithTerm } from "./types";

export const getBlogParamsFromReq = (obj: CreateBlogDto) => {
  return {
    name: obj.name,
    description: obj.description,
    websiteUrl: obj.websiteUrl,
  };
};

export const getQueryFromReq = (obj: QueryParams, id?: string) => {
  return {
    ...(id && { blogId: id }),
    ...(obj.sortBy && { sortBy: obj.sortBy }),
    ...(obj.sortDirection && { sortDirection: obj.sortDirection }),
    ...(obj.pageNumber && { pageNumber: Number(obj.pageNumber) }),
    ...(obj.pageSize && { pageSize: Number(obj.pageSize) }),
  };
};

export const getQueryFromReqBlog = (obj: QueryParamsWithTerm) => {
  return {
    ...(obj.searchNameTerm && { searchNameTerm: obj.searchNameTerm }),
    ...(obj.sortBy && { sortBy: obj.sortBy }),
    ...(obj.sortDirection && { sortDirection: obj.sortDirection }),
    ...(obj.pageNumber && { pageNumber: Number(obj.pageNumber) }),
    ...(obj.pageSize && { pageSize: Number(obj.pageSize) }),
  };
};

export const getPostsParamsFromReq = (obj: PostDatabase) => {
  return {
    blogId: obj.blogId,
    blogName: obj.blogName,
    title: obj.title,
    shortDescription: obj.shortDescription,
    content: obj.content,
  };
};

export const getUpdatePostsParamsFromReq = (obj: PostDatabase) => {
  return {
    id: obj.id,
    blogId: obj.blogId,
    blogName: obj.blogName,
    title: obj.title,
    shortDescription: obj.shortDescription,
    content: obj.content,
  };
};
