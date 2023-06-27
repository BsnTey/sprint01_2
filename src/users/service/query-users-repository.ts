import { ObjectId } from "mongodb";
import { usersCollections } from "../../setting";

export const userQueryRepository = {
  // async findAllBlogs({ searchNameTerm = "", sortBy = "createdAt", sortDirection = "desc", pageNumber = 1, pageSize = 10 }) {
  //   const nameBlog = searchNameTerm ? { name: { $regex: new RegExp(searchNameTerm, "i") } } : {};
  //   const totalCount = await blogsCollections.countDocuments(nameBlog);

  //   const pagesCount = Math.ceil(totalCount / pageSize);

  //   let items = await blogsCollections
  //     .find(nameBlog)
  //     .sort({
  //       [sortBy]: TypeSortAskDesk[sortDirection],
  //     })
  //     .skip((+pageNumber - 1) * +pageSize)
  //     .limit(+pageSize)
  //     .toArray();

  //   items = items.map((item) => {
  //     const id = item._id.toString();
  //     delete (item as any)._id;

  //     return {
  //       ...item,
  //       id,
  //     };
  //   });

  //   return {
  //     pagesCount,
  //     page: pageNumber,
  //     pageSize,
  //     totalCount,
  //     items,
  //   };
  // },

  async findUserById(id: string) {
    return await usersCollections.findOne({ _id: new ObjectId(id) });
  },
};
