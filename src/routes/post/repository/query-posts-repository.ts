import { ObjectId } from "mongodb";
import { postsCollections } from "../../../setting";
import { QueryParamsWithId, TypeSortAskDesk } from "../../../types";

export const postQueryRepository = {
  async findAllPosts({ blogId, sortBy = "createdAt", sortDirection = "desc", pageNumber = 1, pageSize = 10 }: Partial<QueryParamsWithId>) {
    const isBlogSearch: {} | { id: string } = blogId ? { blogId: { $eq: blogId } } : {};
    const totalCount = await postsCollections.countDocuments(isBlogSearch);

    const pagesCount = Math.ceil(totalCount / pageSize);

    let items = await postsCollections
      .find(isBlogSearch)
      .sort({
        [sortBy]: TypeSortAskDesk[sortDirection],
      })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .toArray();

    items = items.map((item) => {
      const id = item._id.toString();
      delete (item as any)._id;
      return {
        ...item,
        id,
      };
    });

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items,
    };
  },

  async findPostById(id: string) {
    const post = await postsCollections.findOne({ _id: new ObjectId(id) });

    if (post) {
      post.id = post._id.toString();
      delete (post as any)._id;
    }
    return post;
  },
};
