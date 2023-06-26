import { Router, Request, Response } from "express";
import { OutputGetAllResponse, PostDatabase, QueryParams, RequestBody, RequestBodyId, ResponseBody } from "../../types";
import { CreatePostDto } from "./post.dto";
import { checkPostRoute } from "./schema";
import { postsService } from "./service/posts-service";

import { inputValidationMiddleware, isAuthMiddleware, isValidIdMiddleware } from "../../middleware/input-validation-middleware";
import { postQueryRepository } from "./repository/query-posts-repository";
import { getPostsParamsFromReq, getQueryFromReq } from "../../utils";
import { blogQueryRepository } from "../blog/repository/query-blogs-repository";

export const postsRoute = Router({});

postsRoute.get("/", async (req: Request, res: ResponseBody<OutputGetAllResponse<PostDatabase>>) => {
  const queryParams: QueryParams = getQueryFromReq(req.query);
  const data = await postQueryRepository.findAllPosts(queryParams);
  return res.json(data);
});

postsRoute.post("/", isAuthMiddleware, checkPostRoute, inputValidationMiddleware, async (req: RequestBody<CreatePostDto>, res: ResponseBody<PostDatabase>) => {
  const isExcistBlog = await blogQueryRepository.findBlogById(req.body.blogId);
  if (!isExcistBlog) return res.sendStatus(404);

  const item = await postsService.createPost(req.body, isExcistBlog.name);
  if (item) return res.status(201).send(item);
  return res.sendStatus(520);
});

postsRoute.get("/:id", isValidIdMiddleware, async (req: Request, res: ResponseBody<PostDatabase>) => {
  const idSearch = req.params.id;

  const isExcistPost = await postQueryRepository.findPostById(idSearch);
  if (!isExcistPost) return res.sendStatus(404);
  return res.status(200).send(isExcistPost);
});

postsRoute.put("/:id", isAuthMiddleware, isValidIdMiddleware, checkPostRoute, inputValidationMiddleware, async (req: RequestBodyId<CreatePostDto>, res: Response) => {
  const idSearch = req.params.id;
  let blogId = req.body.blogId;

  const isExcistPost = await postQueryRepository.findPostById(idSearch);
  if (!isExcistPost) return res.sendStatus(404);

  let blogName = isExcistPost.blogName;

  // зачем тогда мы прислылаем в теле blogId, если его нельзя изменить? если можно, то берем новый
  if (isExcistPost.blogId !== blogId) {
    const isExcistBlog = await blogQueryRepository.findBlogById(blogId);
    if (!isExcistBlog) return res.sendStatus(404);
    blogName = isExcistBlog.name;
  }

  const result = await postsService.updatePost(idSearch, req.body, blogName);
  const status = result ? 204 : 404;
  return res.sendStatus(status);
});

postsRoute.delete("/:id", isAuthMiddleware, isValidIdMiddleware, async (req: Request, res: Response) => {
  const idParams = req.params.id;
  const result = await postsService.deletePost(idParams);
  const status = result ? 204 : 404;
  return res.sendStatus(status);
});
