import { checkSchema } from "express-validator";

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
