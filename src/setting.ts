import express from 'express';
import { blogsRoute } from './routes/blog/blogsRoute';
import { postsRoute } from './routes/post/postsRoute';
import { authRoute } from './routes/auth/authRoute';
import { userRoute } from './routes/users/userRoute';
import { commentRoute } from './routes/comments/commentRoute';
import {
  BlogDatabase,
  CommentDatabase,
  PostDatabase,
  UserDatabase,
} from './types';
import { run, db } from './database/connect';
import cookieParser from 'cookie-parser';

export const app = express();
run().catch(console.dir);

export const blogsCollections = db.collection<BlogDatabase>('blogs');
export const postsCollections = db.collection<PostDatabase>('posts');
export const usersCollections = db.collection<UserDatabase>('users');
export const commentsCollections = db.collection<CommentDatabase>('comments');

app.use(cookieParser());
app.use(express.json());

app.use('/blogs', blogsRoute);
app.use('/posts', postsRoute);
app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/comments', commentRoute);
