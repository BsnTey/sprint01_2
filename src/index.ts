import { Request, Response } from "express";
import { app } from "./setting";
import { postCqrsRepository } from "./routes/post/repository/posts-repository";
import { blogCqrsRepository } from "./routes/blog/repository/blogs-repository";
import { userCqrsRepository } from "./routes/users/repository/users-repository";
import { port } from "./constant";
import { commentCqrsRepository } from "./routes/comments/repository/comments-repository";

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello</h1>");
});

app.delete("/testing/all-data", (req: Request, res: Response) => {
  postCqrsRepository.deleteAll();
  blogCqrsRepository.deleteAll();
  userCqrsRepository.deleteAll();
  commentCqrsRepository.deleteAll();
  res.sendStatus(204);
});
