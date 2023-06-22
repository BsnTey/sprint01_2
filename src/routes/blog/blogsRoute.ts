import { Router, Request, Response } from "express";
import { databaseBlogs } from "../../setting";
import { checkBlogRoute } from "./schema";
import { inputValidationMiddleware, isAuthMiddleware } from "../../middleware/input-validation-middleware";

export const blogsRoute = Router({});

blogsRoute.get("/", (_req: Request, res: Response) => {
  const data = databaseBlogs.getAll();
  res.json(data);
});

blogsRoute.post("/", isAuthMiddleware, checkBlogRoute, inputValidationMiddleware, (req: Request, res: Response) => {
  const data = {
    id: Date.now().toString(),
    ...req.body,
  };

  databaseBlogs.insert(data);
  return res.status(201).send(data);
});

blogsRoute.get("/:id", (req: Request, res: Response) => {
  const data = databaseBlogs.findOne(req.params.id);

  if (!data) {
    return res.sendStatus(404);
  }

  return res.status(200).send(data);
});

blogsRoute.put("/:id", isAuthMiddleware, checkBlogRoute, inputValidationMiddleware, (req: Request, res: Response) => {
  let data = databaseBlogs.findOne(req.params.id);
  if (!data) {
    return res.sendStatus(404);
  }

  data = {
    id: data.id,
    ...req.body,
  };
  databaseBlogs.replace(data!);
  return res.sendStatus(204);
});

blogsRoute.delete("/:id", isAuthMiddleware, (req: Request, res: Response) => {
  let data = databaseBlogs.findOne(req.params.id);
  if (!data) {
    return res.sendStatus(404);
  }

  databaseBlogs.deleteId(req.params.id);
  return res.sendStatus(204);
});
