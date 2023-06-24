import { checkSchema } from "express-validator";

export const checkPostRoute = checkSchema({
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
  blogId: {
    trim: true,
    notEmpty: true,
    // не верно в swagger. это число
    isNumeric: true,
  },
});
