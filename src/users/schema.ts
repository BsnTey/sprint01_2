import { checkSchema } from "express-validator";

export const checkUserRoute = checkSchema({
  login: {
    trim: true,
    notEmpty: true,
    isString: true,
    isLength: { options: { min: 3, max: 30 } },
    matches: {
      options: "^[a-zA-Z0-9_-]*$",
    },
  },
  password: {
    trim: true,
    notEmpty: true,
    isString: true,
    isLength: { options: { min: 6, max: 20 } },
  },
  email: {
    trim: true,
    notEmpty: true,
    isString: true,
    matches: {
      options: "^[w-.]+@([w-]+.)+[w-]{2,4}$",
    },
  },
});
