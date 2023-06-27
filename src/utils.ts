import { QueryParams, QueryParamsWithLogEmail, QueryParamsWithTerm } from "./types";
import * as bcrypt from "bcrypt";

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

export const getQueryFromReqUser = (obj: QueryParamsWithLogEmail) => {
  return {
    ...(obj.searchLoginTerm && { searchLoginTerm: obj.searchLoginTerm }),
    ...(obj.searchEmailTerm && { searchEmailTerm: obj.searchEmailTerm }),
    ...(obj.sortBy && { sortBy: obj.sortBy }),
    ...(obj.sortDirection && { sortDirection: obj.sortDirection }),
    ...(obj.pageNumber && { pageNumber: Number(obj.pageNumber) }),
    ...(obj.pageSize && { pageSize: Number(obj.pageSize) }),
  };
};

export const generateHash = async (password: string, passwordSalt: string): Promise<string> => {
  return await bcrypt.hash(password, passwordSalt);
};
