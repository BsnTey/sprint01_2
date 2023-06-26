import { blogsCollections } from "../../../setting";
import { SortDirection } from "mongodb";

const typeSort: {
  [key: string]: SortDirection;
} = {
  desc: -1,
  asc: 1,
};

// db.mybase.count({"title" : "MySQL"}) 1
export const blogQueryRepository = {
  async findAllBlogs({ searchNameTerm = null, sortBy = "createdAt", sortDirection = "desc", pageNumber = 1, pageSize = 10 }) {
    const nameBlog = searchNameTerm ? { name: { $regex: new RegExp(searchNameTerm, "i") } } : {};
    const totalCount = await blogsCollections.countDocuments(nameBlog);

    const pagesCount = Math.ceil(totalCount / pageSize);

    const items = await blogsCollections
      .find(nameBlog, { projection: { _id: 0 } })
      .sort({
        [sortBy]: typeSort[sortDirection],
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
    return await blogsCollections.findOne({ id: { $eq: id } }, { projection: { _id: 0 } });
  },
};
