import { Request, Response } from "express";
import { app } from "./setting";
import { postRepository } from "./database/repository/posts-repository";
import { blogRepository } from "./database/repository/blogs-repository";

import { port } from "./constant";

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello</h1>");
});

app.delete("/testing/all-data", (req: Request, res: Response) => {
  postRepository.deleteAll();
  blogRepository.deleteAll();
  res.sendStatus(204);
});
