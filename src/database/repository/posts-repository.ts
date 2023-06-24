import { DeleteResult, InsertOneResult, UpdateResult } from "mongodb";
import { postsCollections } from "../../setting";
import { PostDatabase } from "../../types";

export const postRepository = {
  async findAllPosts() {
    return await postsCollections.find({}, { projection: { _id: 0 } }).toArray();
  },

  async findPostById(id: string) {
    const post: PostDatabase | null = await postsCollections.findOne({ id: { $eq: id } }, { projection: { _id: 0 } });
    if (post) {
      return post;
    } else {
      return null;
    }
  },

  async insertPost(post: Partial<PostDatabase>) {
    const result: InsertOneResult<PostDatabase> = await postsCollections.insertOne(post as PostDatabase);
    return result.acknowledged;
  },

  async updatePost(post: Partial<PostDatabase>) {
    const result: UpdateResult<PostDatabase> = await postsCollections.updateOne({ id: post.id }, { $set: post });
    return result.matchedCount === 1;
  },

  async deletePost(id: string) {
    const result: DeleteResult = await postsCollections.deleteOne({ id });
    return result.acknowledged;
  },

  async deleteAll() {
    const result: DeleteResult = await postsCollections.deleteMany({});
    return result.acknowledged;
  },
};
