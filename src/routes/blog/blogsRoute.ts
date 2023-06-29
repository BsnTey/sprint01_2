import { Router, Request, Response } from "express";
import { BlogDatabase, OutputGetAllResponse, PostDatabase, RequestBodyId, ResponseBody, QueryParamsWithTerm, RequestBodyBlogId, RequestBody } from "../../types";
import { CreateBlogDto } from "./blog.dto";
import { checkBlogCreatePostRoute, checkBlogRoute } from "./schema";
import { inputValidationMiddleware, isAuthMiddleware, isExistIdBlogMiddleware } from "../../middleware/input-validation-middleware";
import { blogQueryRepository } from "./repository/query-blogs-repository";
import { blogsService } from "./service/blogs-service";
import { postQueryRepository } from "../post/repository/query-posts-repository";
import { getQueryFromReq, getQueryFromReqBlog } from "../../utils";
import { postsService } from "../post/service/posts-service";

export const blogsRoute = Router({});

blogsRoute.get("/", async (req: Request, res: ResponseBody<OutputGetAllResponse<BlogDatabase>>) => {
  const queryParams: QueryParamsWithTerm = getQueryFromReqBlog(req.query);

  const data = await blogQueryRepository.findAllBlogs(queryParams);
  return res.json(data);
});

blogsRoute.post("/", isAuthMiddleware, checkBlogRoute, inputValidationMiddleware, async (req: RequestBody<CreateBlogDto>, res: Response) => {
  const item = await blogsService.createBlog(req.body);

  if (item) return res.status(201).send(item);
  return res.sendStatus(520);
});

blogsRoute.post(
  "/:id/posts",
  isAuthMiddleware,
  isExistIdBlogMiddleware,
  checkBlogCreatePostRoute,
  inputValidationMiddleware,
  async (req: RequestBodyId<PostDatabase>, res: Response) => {
    const item = await postsService.createPost(req.body);

    if (item) return res.status(201).send(item);
    return res.sendStatus(520);
  }
);

blogsRoute.get("/:id/posts", isExistIdBlogMiddleware, async (req: Request, res: ResponseBody<OutputGetAllResponse<PostDatabase>>) => {
  const idSearch = req.params.id;
  const queryParams: any = getQueryFromReq(req.query, { idBlog: idSearch });

  const data = await postQueryRepository.findAllPosts(queryParams);

  if (!data) return res.sendStatus(404);
  return res.status(200).send(data);
});

blogsRoute.get("/:id", isExistIdBlogMiddleware, async (req: Request, res: Response) => {
  const findBlog = await blogQueryRepository.findBlogById(req.params.id);
  if (!findBlog) return res.sendStatus(404);
  return res.status(200).send(findBlog);
});

blogsRoute.put("/:id", isAuthMiddleware, isExistIdBlogMiddleware, checkBlogRoute, inputValidationMiddleware, async (req: RequestBodyId<CreateBlogDto>, res: Response) => {
  const result = await blogsService.updateBlog(req.params.id, req.body);
  const status = result ? 204 : 404;
  return res.sendStatus(status);
});

blogsRoute.delete("/:id", isAuthMiddleware, isExistIdBlogMiddleware, async (req: RequestBodyId<CreateBlogDto>, res: Response) => {
  const result = await blogsService.deleteBlog(req.params.id);
  const status = result ? 204 : 404;
  return res.sendStatus(status);
});
