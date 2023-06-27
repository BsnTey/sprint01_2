import { checkSchema } from "express-validator";
import { blogQueryRepository } from "../blog/repository/query-blogs-repository";

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
    isString: true,
    custom: {
      options: async (blogId, { req }) => {
        const blog = await blogQueryRepository.findBlogById(blogId);
        if (!blog) {
          throw new Error("Blog does not exist");
        }
        req.body["blogId"] = blogId;
        req.body["blogName"] = blog.name;
      },
    },
  },
});
