import { postsCollections } from "../../../setting";
import { PostDatabase } from "../../../types";

export const postQueryRepository = {
  async findAllPosts() {
    return await postsCollections.find({}, { projection: { _id: 0 } }).toArray();
  },

  async findPostById(id: string) {
    return await postsCollections.findOne({ id: { $eq: id } }, { projection: { _id: 0 } });
  },
};
