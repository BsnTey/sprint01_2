import { ObjectId } from "mongodb";
import { TypeSortAskDesk } from "../../../types";
import { commentsCollections } from "../../../setting";
import { CommentDatabaseOutput } from "../../../types";

export const commentQueryRepository = {
  // async findAllUsers({ searchLoginTerm = "", searchEmailTerm = "", sortBy = "createdAt", sortDirection = "desc", pageNumber = 1, pageSize = 10 }) {
  //   const filter = {
  //     $or: [{ login: { $regex: new RegExp(searchLoginTerm, "i") } }, { email: { $regex: new RegExp(searchEmailTerm, "i") } }],
  //   };

  //   const totalCount = await usersCollections.countDocuments(filter);

  //   const pagesCount = Math.ceil(totalCount / pageSize);

  //   const items = await usersCollections
  //     .find(filter)
  //     .sort({
  //       [sortBy]: TypeSortAskDesk[sortDirection],
  //     })
  //     .skip((+pageNumber - 1) * +pageSize)
  //     .limit(+pageSize)
  //     .toArray();

  //   const filterItems = items.map((item) => {
  //     const id = item._id.toString();
  //     return {
  //       id,
  //       login: item.login,
  //       email: item.email,
  //       createdAt: item.createdAt,
  //     };
  //   });

  //   return {
  //     pagesCount,
  //     page: pageNumber,
  //     pageSize,
  //     totalCount,
  //     items: filterItems,
  //   };
  // },

  async findCommentById(id: string) {
    let filterComment: CommentDatabaseOutput | null = null;
    const comment = await commentsCollections.findOne({ _id: new ObjectId(id) });
    if (comment) {
      filterComment = {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
          userId: comment.commentatorInfo.userId,
          userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt,
      };
    }
    return filterComment;
  },
};
