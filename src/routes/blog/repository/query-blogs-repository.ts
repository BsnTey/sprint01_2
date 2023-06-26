import { blogsCollections } from "../../../setting";
import { TypeSortAskDesk } from "../../../types";
import { QueryParamsWithId } from "../../../types";
import { postQueryRepository } from "../../post/repository/query-posts-repository";

export const blogQueryRepository = {
  async findAllBlogs({ searchNameTerm = "", sortBy = "createdAt", sortDirection = "desc", pageNumber = 1, pageSize = 10 }) {
    const nameBlog = searchNameTerm ? { name: { $regex: new RegExp(searchNameTerm, "i") } } : {};
    console.log("findAllBlogs", pageNumber, pageSize, searchNameTerm);
    const totalCount = await blogsCollections.countDocuments(nameBlog);

    const pagesCount = Math.ceil(totalCount / pageSize);

    const items = await blogsCollections
      .find(nameBlog, { projection: { _id: 0 } })
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

  async findPostsByBlogId({ blogId, sortBy = "createdAt", sortDirection = "desc", pageNumber = 1, pageSize = 10 }: QueryParamsWithId) {
    const postsId = { blogId };

    //const result = await postQueryRepository.findAllPosts(blogId); исправить. здесь должны найти количество постов по блогу id

    // const pagesCount = Math.ceil(totalCount / pageSize);

    // const items = await blogsCollections
    //   .find(postsId, { projection: { _id: 0 } })
    //   .sort({
    //     [sortBy]: TypeSortAskDesk[sortDirection],
    //   })
    //   .skip((+pageNumber - 1) * +pageSize)
    //   .limit(+pageSize)
    //   .toArray();

    // return {
    //   pagesCount,
    //   page: pageNumber,
    //   pageSize,
    //   totalCount,
    //   items,
    // };
  },

  async findBlogById(id: string) {
    return await blogsCollections.findOne({ id: { $eq: id } }, { projection: { _id: 0 } });
  },
};
