import { Router, Request, Response } from "express";
import { PostDatabase, RequestBody, RequestBodyId, ResponseBody } from "../../types";
import { CreatePostDto } from "./post.dto";
import { checkPostRoute } from "./schema";
import { postsService } from "./service/posts-service";

import { inputValidationMiddleware, isAuthMiddleware } from "../../middleware/input-validation-middleware";
import { postQueryRepository } from "./repository/query-posts-repository";

export const postsRoute = Router({});

postsRoute.get("/", async (_req: Request, res: ResponseBody<PostDatabase[]>) => {
  const data = await postQueryRepository.findAllPosts();
  return res.json(data);
});

postsRoute.post("/", isAuthMiddleware, checkPostRoute, inputValidationMiddleware, async (req: RequestBody<CreatePostDto>, res: ResponseBody<PostDatabase>) => {
  const item = await postsService.createPost(req.body);

  if (item) return res.status(201).send(item);
  return res.sendStatus(520);
});

postsRoute.get("/:id", async (req: Request, res: ResponseBody<PostDatabase>) => {
  const data = await postQueryRepository.findPostById(req.params.id);

  if (!data) return res.sendStatus(404);
  return res.status(200).send(data);
});

postsRoute.put("/:id", isAuthMiddleware, checkPostRoute, inputValidationMiddleware, async (req: RequestBodyId<CreatePostDto>, res: Response) => {
  const idParams = req.params.id;
  const result = await postsService.updatePost(idParams, req.body);
  const status = result ? 204 : 404;
  return res.sendStatus(status);
});

postsRoute.delete("/:id", isAuthMiddleware, async (req: Request, res: Response) => {
  const idParams = req.params.id;
  const result = await postsService.deletePost(idParams);
  const status = result ? 204 : 404;
  return res.sendStatus(status);
});
