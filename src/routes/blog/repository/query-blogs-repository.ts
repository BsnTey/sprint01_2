import { blogsCollections } from "../../../setting";
import { BlogDatabase } from "../../../types";

export const blogQueryRepository = {
  async findAllBlogs() {
    return await blogsCollections.find({}, { projection: { _id: 0 } }).toArray();
  },

  async findBlogById(id: string) {
    return await blogsCollections.findOne({ id: { $eq: id } }, { projection: { _id: 0 } });
  },
};
