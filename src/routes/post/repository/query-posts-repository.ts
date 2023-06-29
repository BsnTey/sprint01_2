import { ObjectId } from "mongodb";
import { commentsCollections, postsCollections } from "../../../setting";
import { QueryParamsPostWithId, QueryParamsWithId, TypeSortAskDesk } from "../../../types";

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

  async findAllComments({ postId, sortBy = "createdAt", sortDirection = "desc", pageNumber = 1, pageSize = 10 }: Partial<QueryParamsPostWithId>) {
    const isPostSearch: {} | { id: string } = postId ? { postId: { $eq: postId } } : {};
    const totalCount = await commentsCollections.countDocuments(isPostSearch);

    const pagesCount = Math.ceil(totalCount / pageSize);

    const items = await commentsCollections
      .find(isPostSearch)
      .sort({
        [sortBy]: TypeSortAskDesk[sortDirection],
      })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .toArray();

    const newItems = items.map((item) => {
      return {
        id: item._id.toString(),
        commentatorInfo: {
          userId: item.commentatorInfo.userId,
          userLogin: item.commentatorInfo.userLogin,
        },
        createdAt: item.createdAt,
      };
    });

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: newItems,
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
