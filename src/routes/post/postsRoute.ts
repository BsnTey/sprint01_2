import { Router, Request, Response } from "express";
import { PostDatabase, RequestBody, RequestBodyId, ResponseBody } from "../../types";
import { CreatePostDto } from "./post.dto";
import { checkPostRoute } from "./schema";
import { postRepository } from "../../database/repository/posts-repository";
import { inputValidationMiddleware, isAuthMiddleware } from "../../middleware/input-validation-middleware";

export const postsRoute = Router({});

postsRoute.get("/", async (_req: Request, res: ResponseBody<PostDatabase[]>) => {
  const data = await postRepository.findAllPosts();
  res.json(data);
});

postsRoute.post("/", isAuthMiddleware, checkPostRoute, inputValidationMiddleware, async (req: RequestBody<CreatePostDto>, res: ResponseBody<PostDatabase>) => {
  const data = {
    ...req.body,
    id: Date.now().toString(),
    blogName: "string",
  };

  const result = await postRepository.insertPost(data);
  if (!result) {
    return res.sendStatus(520);
  }
  const getData = await postRepository.findPostById(data.id);
  if (getData) {
    return res.status(201).send(getData);
  } else {
    return res.sendStatus(520);
  }
});

postsRoute.get("/:id", async (req: Request, res: ResponseBody<PostDatabase>) => {
  const data = await postRepository.findPostById(req.params.id);

  if (!data) {
    return res.sendStatus(404);
  }
  return res.status(200).send(data);
});

postsRoute.put("/:id", isAuthMiddleware, checkPostRoute, inputValidationMiddleware, async (req: RequestBodyId<CreatePostDto>, res: Response) => {
  let data = await postRepository.findPostById(req.params.id);
  if (!data) {
    return res.sendStatus(404);
  }

  data = {
    ...data,
    ...req.body,
  };
  const result = await postRepository.updatePost(data);
  if (result) {
    return res.sendStatus(204);
  } else {
    return res.sendStatus(520);
  }
});

postsRoute.delete("/:id", isAuthMiddleware, async (req: Request, res: Response) => {
  let data = await postRepository.findPostById(req.params.id);
  if (!data) {
    return res.sendStatus(404);
  }

  const result = await postRepository.deletePost(req.params.id);
  if (result) {
    return res.sendStatus(204);
  } else {
    return res.sendStatus(520);
  }
});
