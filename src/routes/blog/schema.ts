import { checkSchema } from "express-validator";

export const checkBlogRoute = checkSchema({
  name: {
    notEmpty: true,
    isString: true,
    isLength: { options: { max: 15 } },
  },
  description: {
    notEmpty: true,
    isString: true,
    isLength: { options: { max: 500 } },
  },
  websiteUrl: {
    notEmpty: true,
    isString: true,
    isLength: { options: { max: 100 } },
    matches: {
      options: "^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$",
    },
  },
});
