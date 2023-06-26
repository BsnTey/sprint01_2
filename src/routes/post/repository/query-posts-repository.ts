import { postsCollections } from "../../../setting";
import { QueryParamsWithId, TypeSortAskDesk } from "../../../types";

export const postQueryRepository = {
  async findAllPosts({ blogId, sortBy = "createdAt", sortDirection = "desc", pageNumber = 1, pageSize = 10 }: Partial<QueryParamsWithId>) {
    const isBlogSearch: {} | { id: string } = blogId ? { blogId: { $eq: blogId } } : {};
    console.log("findAllPosts", pageNumber, pageSize, isBlogSearch);
    const totalCount = await postsCollections.countDocuments(isBlogSearch);

    const pagesCount = Math.ceil(totalCount / pageSize);

    const items = await postsCollections
      .find(isBlogSearch, { projection: { _id: 0 } })
      .sort({
        [sortBy]: TypeSortAskDesk[sortDirection],
      })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .toArray();

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items,
    };
  },

  async findPostById(id: string) {
    return await postsCollections.findOne({ id: { $eq: id } }, { projection: { _id: 0 } });
  },
};
