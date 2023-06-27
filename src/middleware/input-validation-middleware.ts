import { Request, Response } from "express";
import { NextFunction } from "express";
import { validationResult } from "express-validator";
import { blogQueryRepository } from "../routes/blog/repository/query-blogs-repository";
import { postQueryRepository } from "../routes/post/repository/query-posts-repository";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const reformattedErrors = errors.array({ onlyFirstError: true }).map((err) => {
      // @ts-ignore
      return { message: err.msg, field: err.path };
    });

    res.status(400).json({ errorsMessages: reformattedErrors });
  } else {
    next();
  }
};

export const isAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader: string | undefined = req.headers.authorization;
  if (authHeader !== "Basic YWRtaW46cXdlcnR5") {
    res.sendStatus(401);
    return;
  } else {
    next();
  }
};

export const isValidIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const id: string = req.params.id;
  if (!id) {
    res.sendStatus(404);
    return;
  } else {
    next();
  }
};

export const isExistIdBlogMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const idBlog: string = req.params.id;
  if (!idBlog) {
    res.sendStatus(400);
    return;
  }
  const blog = await blogQueryRepository.findBlogById(idBlog);
  if (!blog) {
    res.sendStatus(404);
    return;
  }
  next();
};

export const isExistIdPostMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const idPost: string = req.params.id;
  if (!idPost) {
    res.sendStatus(400);
    return;
  }
  const post = await postQueryRepository.findPostById(idPost);
  if (!post) {
    res.sendStatus(404);
    return;
  }
  next();
};
