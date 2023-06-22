import { Router, Request, Response } from "express";
import { databasePosts } from "../../setting";
import { checkPostRoute } from "./schema";
import { inputValidationMiddleware, isAuthMiddleware } from "../../middleware/input-validation-middleware";

export const postsRoute = Router({});

postsRoute.get("/", (_req: Request, res: Response) => {
  const data = databasePosts.getAll();
  res.json(data);
});

postsRoute.post("/", isAuthMiddleware, checkPostRoute, inputValidationMiddleware, (req: Request, res: Response) => {
  const data = {
    id: Date.now().toString(),
    ...req.body,
    blogName: "string",
  };

  databasePosts.insert(data);
  return res.status(201).send(data);
});

postsRoute.get("/:id", (req: Request, res: Response) => {
  const data = databasePosts.findOne(req.params.id);

  if (!data) {
    return res.sendStatus(404);
  }

  return res.status(200).send(data);
});

postsRoute.put("/:id", isAuthMiddleware, checkPostRoute, inputValidationMiddleware, (req: Request, res: Response) => {
  let data = databasePosts.findOne(req.params.id);
  if (!data) {
    return res.sendStatus(404);
  }

  data = {
    id: data.id,
    blogName: data.blogName,
    ...req.body,
  };
  databasePosts.replace(data!);
  return res.sendStatus(204);
});

postsRoute.delete("/:id", isAuthMiddleware, (req: Request, res: Response) => {
  let data = databasePosts.findOne(req.params.id);
  if (!data) {
    return res.sendStatus(404);
  }

  databasePosts.deleteId(req.params.id);
  return res.sendStatus(204);
});
