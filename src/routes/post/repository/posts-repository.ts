import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { postsCollections } from "../../../setting";
import { PostDatabase } from "../../../types";

export const postCqrsRepository = {
  async insertPost(post: Partial<PostDatabase>) {
    const result: InsertOneResult<PostDatabase> = await postsCollections.insertOne(post as PostDatabase);
    return result.insertedId;
  },

  async updatePost(id: string, post: Partial<PostDatabase>) {
    const result: UpdateResult<PostDatabase> = await postsCollections.updateOne({ _id: new ObjectId(id) }, { $set: post });
    return result.matchedCount === 1;
  },

  async deletePost(id: string) {
    const result: DeleteResult = await postsCollections.deleteOne({ _id: new ObjectId(id) });
    return result.acknowledged;
  },

  async deleteAll() {
    const result: DeleteResult = await postsCollections.deleteMany({});
    return result.acknowledged;
  },
};
