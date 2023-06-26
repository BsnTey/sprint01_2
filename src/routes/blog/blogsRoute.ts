import { Router, Request, Response } from "express";
import { BlogDatabase, QueryParams, QueryParamsWithId, OutputGetAllResponse, PostDatabase, RequestBody, RequestBodyId, ResponseBody, QueryParamsWithTerm } from "../../types";
import { CreateBlogDto } from "./blog.dto";
import { checkBlogCreatePostRoute, checkBlogRoute } from "./schema";
import { inputValidationMiddleware, isAuthMiddleware, isValidIdMiddleware } from "../../middleware/input-validation-middleware";
import { blogQueryRepository } from "./repository/query-blogs-repository";
import { blogsService } from "./service/blogs-service";
import { postQueryRepository } from "../post/repository/query-posts-repository";
import { getBlogParamsFromReq, getQueryFromReq, getQueryFromReqBlog } from "../../utils";
import { postsService } from "../post/service/posts-service";
import { CreatePostDto } from "../post/post.dto";

export const blogsRoute = Router({});

blogsRoute.get("/", async (req: Request, res: ResponseBody<OutputGetAllResponse<BlogDatabase>>) => {
  console.log("get id 0 ", req.query);
  const queryParams: QueryParamsWithTerm = getQueryFromReqBlog(req.query);
  console.log("get id", queryParams);
  const data = await blogQueryRepository.findAllBlogs(queryParams);
  return res.json(data);
});

blogsRoute.post("/", isAuthMiddleware, checkBlogRoute, inputValidationMiddleware, async (req: RequestBodyId<CreateBlogDto>, res: Response) => {
  const item = await blogsService.createBlog(req.body);

  if (item) return res.status(201).send(item);
  return res.sendStatus(520);
});

blogsRoute.post(
  "/:id/posts",
  isAuthMiddleware,
  isValidIdMiddleware,
  checkBlogCreatePostRoute,
  inputValidationMiddleware,
  async (req: RequestBodyId<CreatePostDto>, res: Response) => {
    const idSearch = req.params.id;

    const isExcistBlog = await blogQueryRepository.findBlogById(idSearch);
    if (!isExcistBlog) return res.sendStatus(404);

    const item = await postsService.createPost(req.body, isExcistBlog.name);

    if (item) return res.status(201).send(item);
    return res.sendStatus(520);
  }
);

blogsRoute.get("/:id/posts", isValidIdMiddleware, async (req: Request, res: ResponseBody<OutputGetAllResponse<PostDatabase>>) => {
  const idSearch = req.params.id;
  const queryParams: any = getQueryFromReq(req.query, idSearch);
  console.log("get id", queryParams);

  const data = await postQueryRepository.findAllPosts(queryParams);

  if (!data) return res.sendStatus(404);
  return res.status(200).send(data);
});

blogsRoute.get("/:id", isValidIdMiddleware, async (req: Request, res: Response) => {
  const idSearch = req.params.id;

  const data = await blogQueryRepository.findBlogById(idSearch);

  if (!data) return res.sendStatus(404);
  return res.status(200).send(data);
});

blogsRoute.put("/:id", isAuthMiddleware, isValidIdMiddleware, checkBlogRoute, inputValidationMiddleware, async (req: RequestBodyId<CreateBlogDto>, res: Response) => {
  const idSearch = req.params.id;
  const bodyParams = getBlogParamsFromReq(req.body);

  const result = await blogsService.updateBlog(idSearch, bodyParams);
  const status = result ? 204 : 404;
  return res.sendStatus(status);
});

blogsRoute.delete("/:id", isAuthMiddleware, isValidIdMiddleware, async (req: Request, res: Response) => {
  const idSearch = req.params.id;

  const result = await blogsService.deleteBlog(idSearch);
  const status = result ? 204 : 404;
  return res.sendStatus(status);
});
