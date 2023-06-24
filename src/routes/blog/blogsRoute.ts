import { Router, Request, Response } from "express";
import { BlogDatabase, RequestBody, RequestBodyId, ResponseBody } from "../../types";
import { CreateBlogDto } from "./blog.dto";
import { blogRepository } from "../../database/repository/blogs-repository";
import { checkBlogRoute } from "./schema";
import { inputValidationMiddleware, isAuthMiddleware } from "../../middleware/input-validation-middleware";

export const blogsRoute = Router({});

blogsRoute.get("/", async (_req: Request, res: ResponseBody<BlogDatabase[]>) => {
  const data = await blogRepository.findAllBlogs();
  res.json(data);
});

blogsRoute.post("/", isAuthMiddleware, checkBlogRoute, inputValidationMiddleware, async (req: RequestBodyId<CreateBlogDto>, res: Response) => {
  const data = {
    id: Date.now().toString(),
    isMembership: false,
    ...req.body,
  };

  const result = await blogRepository.insertBlog(data);
  if (!result) {
    return res.sendStatus(520);
  }
  const getData = await blogRepository.findBlogById(data.id);
  if (getData) {
    return res.status(201).send(getData);
  } else {
    return res.sendStatus(520);
  }
});

blogsRoute.get("/:id", async (req: Request, res: Response) => {
  const data = await blogRepository.findBlogById(req.params.id);

  if (!data) {
    return res.sendStatus(404);
  }

  return res.status(200).send(data);
});

blogsRoute.put("/:id", isAuthMiddleware, checkBlogRoute, inputValidationMiddleware, async (req: RequestBodyId<CreateBlogDto>, res: Response) => {
  let data = await blogRepository.findBlogById(req.params.id);
  if (!data) {
    return res.sendStatus(404);
  }

  data = {
    ...data,
    ...req.body,
  };
  const result = await blogRepository.updateBlog(data);
  if (result) {
    return res.sendStatus(204);
  } else {
    return res.sendStatus(520);
  }
});

blogsRoute.delete("/:id", isAuthMiddleware, async (req: Request, res: Response) => {
  let data = await blogRepository.findBlogById(req.params.id);
  if (!data) {
    return res.sendStatus(404);
  }

  const result = await blogRepository.deleteBlog(req.params.id);
  if (result) {
    return res.sendStatus(204);
  } else {
    return res.sendStatus(520);
  }
});
