import { Request, Response } from "express";

export type RequestBody<T> = Request<{ id: string }, {}, T>;

export interface BlogDatabase {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
}

export interface PostDatabase {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
}
