import express from "express";
import { blogsRoute } from "./routes/blog/blogsRoute";
import { postsRoute } from "./routes/post/postsRoute";
import { authRoute } from "./auth/authRoute";
import { userRoute } from "./users/userRoute";
import { BlogDatabase, PostDatabase, UserDatabase } from "./types";
import { run, db } from "./database/connect";

export const app = express();
run().catch(console.dir);

export const blogsCollections = db.collection<BlogDatabase>("blogs");
export const postsCollections = db.collection<PostDatabase>("posts");
export const usersCollections = db.collection<UserDatabase>("users");

app.use(express.json());

app.use("/blogs", blogsRoute);
app.use("/posts", postsRoute);
app.use("/users", userRoute);
app.use("/auth", authRoute);
