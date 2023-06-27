import { ObjectId } from "mongodb";
import { blogsCollections } from "../../../setting";
import { TypeSortAskDesk } from "../../../types";

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

  async findBlogById(id: string) {
    const blog = await blogsCollections.findOne({ _id: new ObjectId(id) });
    if (blog) {
      blog.id = blog._id.toString();
      delete (blog as any)._id;
    }
    return blog;
  },
};
