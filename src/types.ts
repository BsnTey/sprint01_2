import { Request, Response } from "express";
import { ObjectId } from "mongodb";

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

export interface PostDatabase {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
  blogName: string;
  objectId: ObjectId;
  createdAt: string;
}
