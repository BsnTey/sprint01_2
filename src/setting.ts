import express from "express";
import { DataBase } from "./database/db";
import { blogsRoute } from "./routes/blog/blogsRoute";
import { postsRoute } from "./routes/post/postsRoute";
import { BlogDatabase, PostDatabase } from "./types";

export const app = express();
export const databaseBlogs = new DataBase<BlogDatabase>();
export const databasePosts = new DataBase<PostDatabase>();

app.use(express.json());
app.use("/blogs", blogsRoute);
app.use("/posts", postsRoute);
