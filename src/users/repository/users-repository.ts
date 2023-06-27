import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { usersCollections } from "../../setting";
import { UserDatabase } from "../../types";

export const userCqrsRepository = {
  async insertUser(user: Partial<UserDatabase>) {
    const result: InsertOneResult<UserDatabase> = await usersCollections.insertOne(user as UserDatabase);
    return result.insertedId;
  },

  // async updateBlog(blog: Partial<BlogDatabase>) {
  //   const result: UpdateResult<BlogDatabase> = await blogsCollections.updateOne({ _id: new ObjectId(blog.id) }, { $set: blog });
  //   return result.matchedCount === 1;
  // },

  // async deleteBlog(id: string) {
  //   const result: DeleteResult = await blogsCollections.deleteOne({ _id: new ObjectId(id) });
  //   return result.acknowledged;
  // },

  // async deleteAll() {
  //   const result: DeleteResult = await blogsCollections.deleteMany({});
  //   return result.acknowledged;
  // },
};
