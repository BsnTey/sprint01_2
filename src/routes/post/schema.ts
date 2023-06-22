import { checkSchema } from "express-validator";

export const checkPostRoute = checkSchema({
  title: {
    notEmpty: true,
    isString: true,
    isLength: { options: { max: 30 } },
  },
  shortDescription: {
    notEmpty: true,
    isString: true,
    isLength: { options: { max: 100 } },
  },
  content: {
    notEmpty: true,
    isString: true,
    isLength: { options: { max: 1000 } },
  },
  blogId: {
    notEmpty: true,
    isString: true,
  },
});
