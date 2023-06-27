import { Router, Request, Response } from "express";
import { OutputGetAllResponse, PostDatabase, QueryParams, RequestBody, RequestBodyId, ResponseBody } from "../../types";
import { checkPostRoute } from "./schema";
import { postsService } from "./service/posts-service";
import {
  inputValidationMiddleware,
  isAuthMiddleware,
  isExistIdBlogForPostMiddleware,
  isExistIdPostMiddleware,
  isValidIdMiddleware,
} from "../../middleware/input-validation-middleware";
import { postQueryRepository } from "./repository/query-posts-repository";
import { getQueryFromReq } from "../../utils";

export const postsRoute = Router({});

postsRoute.get("/", async (req: Request, res: ResponseBody<OutputGetAllResponse<PostDatabase>>) => {
  const queryParams: QueryParams = getQueryFromReq(req.query);
  const data = await postQueryRepository.findAllPosts(queryParams);
  return res.json(data);
});

postsRoute.post(
  "/",
  isAuthMiddleware,
  checkPostRoute,
  isExistIdBlogForPostMiddleware,
  inputValidationMiddleware,
  async (req: RequestBody<PostDatabase>, res: ResponseBody<PostDatabase>) => {
    const item = await postsService.createPost(req.body);
    if (item) return res.status(201).send(item);
    return res.sendStatus(520);
  }
);

postsRoute.get("/:id", isValidIdMiddleware, async (req: Request, res: ResponseBody<PostDatabase>) => {
  const idSearch = req.params.id;

  const post = await postQueryRepository.findPostById(idSearch);
  if (!post) return res.sendStatus(404);
  return res.status(200).send(post);
});

postsRoute.put("/:id", isAuthMiddleware, isExistIdPostMiddleware, checkPostRoute, inputValidationMiddleware, async (req: RequestBodyId<PostDatabase>, res: Response) => {
  const result = await postsService.updatePost(req.body);
  const status = result ? 204 : 404;
  return res.sendStatus(status);
});

postsRoute.delete("/:id", isAuthMiddleware, isExistIdPostMiddleware, async (req: Request, res: Response) => {
  const result = await postsService.deletePost(req.params.id);
  const status = result ? 204 : 404;
  return res.sendStatus(status);
});
