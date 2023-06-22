import { Request, Response } from "express";
import { app } from "./setting";
import dotenv from "dotenv";
import { databaseBlogs, databasePosts } from "./setting";

dotenv.config();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello</h1>");
});

app.delete("/testing/all-data", (req: Request, res: Response) => {
  databaseBlogs.clearDB();
  databasePosts.clearDB();
  res.sendStatus(204);
});
