import express from "express";
import { blogsRoute } from "./routes/blog/blogsRoute";
import { postsRoute } from "./routes/post/postsRoute";
import { BlogDatabase, PostDatabase } from "./types";
import { run, db } from "./database/connect";

export const app = express();
run().catch(console.dir);

export const blogsCollections = db.collection<BlogDatabase>("blogs");
export const postsCollections = db.collection<PostDatabase>("posts");

app.use(express.json());

app.use("/blogs", blogsRoute);
app.use("/posts", postsRoute);
