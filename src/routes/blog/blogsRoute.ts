import { Router, Request, Response } from "express";
import { BlogDatabase, OutputGetAllResponse, RequestBody, RequestBodyId, ResponseBody } from "../../types";
import { CreateBlogDto } from "./blog.dto";
import { checkBlogRoute } from "./schema";
import { inputValidationMiddleware, isAuthMiddleware } from "../../middleware/input-validation-middleware";
import { blogQueryRepository } from "./repository/query-blogs-repository";
import { blogsService } from "./service/blogs-service";

export const blogsRoute = Router({});

blogsRoute.get("/", async (req: Request, res: ResponseBody<OutputGetAllResponse<BlogDatabase>>) => {
  const data = await blogQueryRepository.findAllBlogs(req.query);
  return res.json(data);
});

blogsRoute.post("/", isAuthMiddleware, checkBlogRoute, inputValidationMiddleware, async (req: RequestBodyId<CreateBlogDto>, res: Response) => {
  const item = await blogsService.createPost(req.body);

  if (item) return res.status(201).send(item);
  return res.sendStatus(520);
});

blogsRoute.get("/:id", async (req: Request, res: Response) => {
  const data = await blogQueryRepository.findBlogById(req.params.id);

  if (!data) return res.sendStatus(404);
  return res.status(200).send(data);
});

blogsRoute.put("/:id", isAuthMiddleware, checkBlogRoute, inputValidationMiddleware, async (req: RequestBodyId<CreateBlogDto>, res: Response) => {
  const idParams = req.params.id;
  const result = await blogsService.updatePost(idParams, req.body);
  const status = result ? 204 : 404;
  return res.sendStatus(status);
});

blogsRoute.delete("/:id", isAuthMiddleware, async (req: Request, res: Response) => {
  const idParams = req.params.id;
  const result = await blogsService.deletePost(idParams);
  const status = result ? 204 : 404;
  return res.sendStatus(status);
});
