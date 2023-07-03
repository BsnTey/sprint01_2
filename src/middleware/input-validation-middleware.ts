import { Request, Response } from "express";
import { NextFunction } from "express";
import { validationResult } from "express-validator";
import { blogQueryRepository } from "../routes/blog/repository/query-blogs-repository";
import { postQueryRepository } from "../routes/post/repository/query-posts-repository";
import { userQueryRepository } from "../routes/users/repository/query-users-repository";
import { jwtService } from "../application/jwtService";
import jwt from "jsonwebtoken";
import { jwt_access_secret, jwt_refresh_secret } from "../constant";
import { commentQueryRepository } from "../routes/comments/repository/query-comments-repository";

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

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader: string | undefined = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  const userId = await jwtService.getUserByToken(token);

  if (!userId) return res.sendStatus(401);

  const user = await userQueryRepository.findUserById(userId);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  req.user = user;
  next();
};

export const verifyTokenRefresh = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).send({ message: "No token provided!" });
  jwt.verify(refreshToken, jwt_refresh_secret, async (err: any, decoded: any) => {
    if (err) return res.status(401).send({ message: "No verify token!" });
    req.userId = decoded.id;
    next();
  });
};

export const chekTokenInArray = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;
  const userId = req.userId;
  const user = await userQueryRepository.findUserById(userId);
  if (user && !user.tokenData.refreshTokens.includes(refreshToken)) {
    return res.status(401).send({ message: "No valid token!" });
  }
  next();
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
  const blogId: string = req.params.id;
  if (!blogId) {
    res.sendStatus(400);
    return;
  }
  const blog = await blogQueryRepository.findBlogById(blogId);
  if (!blog) {
    res.sendStatus(404);
    return;
  }

  req.body["blogId"] = blog.id;
  req.body["blogName"] = blog.name;
  next();
};

export const isExistIdPostMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const postId: string = req.params.id;
  if (!postId) {
    res.sendStatus(400);
    return;
  }
  try {
    const post = await postQueryRepository.findPostById(postId);

    if (!post) {
      res.sendStatus(404);
      return;
    }
    req.body["postId"] = post.id;
    next();
  } catch (error) {
    res.sendStatus(404);
    return;
  }
};

export const isExistIdUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const userId: string = req.params.id;
  if (!userId) {
    res.sendStatus(400);
    return;
  }
  const user = await userQueryRepository.findUserById(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }
  req.body["id"] = userId;
  next();
};

export const isExistIdCommentMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const commentId: string = req.params.id;
  if (!commentId) return res.sendStatus(400);

  const comment = await commentQueryRepository.findCommentById(commentId);
  if (!comment) return res.sendStatus(404);

  req.body["comment"] = comment;
  next();
};

export const isCommentOwnerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.user._id.toString();
  const userIdComment = req.body.comment.commentatorInfo.userId;
  if (userId !== userIdComment) return res.sendStatus(403);
  next();
};

// export const isUserExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//   const login = req.body.login;
//   const email = req.body.email;

//   const isEmail = userQueryRepository.findUserByEmail(email);
//   if (isEmail) return res;

//   const userId: string = req.params.id;
//   if (!userId) {
//     res.sendStatus(400);
//     return;
//   }
//   const user = await userQueryRepository.findUserById(userId);
//   if (!user) {
//     res.sendStatus(404);
//     return;
//   }
//   req.body["id"] = userId;
//   next();
// };
