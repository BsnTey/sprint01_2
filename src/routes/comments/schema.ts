import { checkSchema } from "express-validator";

export const checkCommentRoute = checkSchema({
  content: {
    trim: true,
    notEmpty: true,
    isString: true,
    isLength: { options: { min: 20, max: 300 } },
  },
});
