import { Request, Response } from "express";
import { ObjectId, SortDirection } from "mongodb";

export type RequestBody<T> = Request<{}, {}, T>;
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

export type QueryParamsWithId = {
  blogId: string;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type QueryParams = Omit<QueryParamsWithId, "blogId">;

export const TypeSortAskDesk: {
  [key: string]: SortDirection;
} = {
  desc: -1,
  asc: 1,
};
