import { checkSchema } from "express-validator";

export const checkAuthRoute = checkSchema({
  loginOrEmail: {
    trim: true,
    notEmpty: true,
    isString: true,
  },
  password: {
    trim: true,
    notEmpty: true,
    isString: true,
  },
});
