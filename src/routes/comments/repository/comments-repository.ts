import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { commentsCollections } from "../../../setting";
import { CommentDatabase } from "../../../types";

export const commentCqrsRepository = {
  async insertComment(comment: Partial<CommentDatabase>) {
    const result: InsertOneResult<CommentDatabase> = await commentsCollections.insertOne(comment as CommentDatabase);
    return result.insertedId;
  },

  async updateComment(id: string, content: string) {
    const result: UpdateResult = await commentsCollections.updateOne({ _id: new ObjectId(id) }, { $set: { content: content } });
    return result.matchedCount === 1;
  },

  async deleteComment(id: string) {
    const result: DeleteResult = await commentsCollections.deleteOne({ _id: new ObjectId(id) });
    return result.acknowledged;
  },

  async deleteAll() {
    const result: DeleteResult = await commentsCollections.deleteMany({});
    return result.acknowledged;
  },
};
