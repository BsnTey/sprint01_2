import { checkSchema } from "express-validator";
import { blogQueryRepository } from "./repository/query-blogs-repository";

export const checkBlogRoute = checkSchema({
  name: {
    trim: true,
    notEmpty: true,
    isString: true,
    isLength: { options: { max: 15 } },
  },
  description: {
    trim: true,
    notEmpty: true,
    isString: true,
    isLength: { options: { max: 500 } },
  },
  websiteUrl: {
    trim: true,
    notEmpty: true,
    isString: true,
    isLength: { options: { max: 100 } },
    matches: {
      options: "^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$",
    },
  },
});

export const checkBlogCreatePostRoute = checkSchema({
  title: {
    trim: true,
    notEmpty: true,
    isString: true,
    isLength: { options: { max: 30 } },
  },
  shortDescription: {
    trim: true,
    notEmpty: true,
    isString: true,
    isLength: { options: { max: 100 } },
  },
  content: {
    trim: true,
    notEmpty: true,
    isString: true,
    isLength: { options: { max: 1000 } },
  },
});
