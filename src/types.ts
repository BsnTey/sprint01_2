import { Request, Response } from "express";
import { ObjectId, SortDirection } from "mongodb";

export type RequestBody<T> = Request<{}, {}, T>;
export type RequestBodyBlogId<T> = Request<{ blogId: string }, {}, T>;
export type RequestBodyId<T> = Request<{ id: string }, {}, T>;
export type ResponseBody<T> = Response<T>;

export interface BlogDatabase {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  objectId: ObjectId;
  isMembership: boolean;
}

export interface OutputGetAllResponse<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

export interface PostDatabase {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  objectId: ObjectId;
  createdAt: string;
}

export interface UserDatabase {
  _id: ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
}

export interface CommentDatabase {
  _id: ObjectId;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
}

export interface CommentDatabaseOutput {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
}

export interface UserDatabaseOutput {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export type QueryParams = {
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type QueryParamsWithId = QueryParams & { blogId: string };
export type QueryParamsWithTerm = QueryParams & { searchNameTerm?: string };
export type QueryParamsWithLogEmail = QueryParams & {
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

export const TypeSortAskDesk: {
  [key: string]: SortDirection;
} = {
  desc: -1,
  asc: 1,
};

export type ResultJwtCreate = {
  accessToken: string;
};
