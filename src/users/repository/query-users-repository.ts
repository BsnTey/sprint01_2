import { ObjectId } from "mongodb";
import { usersCollections } from "../../setting";
import { TypeSortAskDesk } from "../../types";

export const userQueryRepository = {
  async findAllUsers({ searchLoginTerm = "", searchEmailTerm = "", sortBy = "createdAt", sortDirection = "desc", pageNumber = 1, pageSize = 10 }) {
    const searchLogin = searchLoginTerm ? { login: { $regex: new RegExp(searchLoginTerm, "i") } } : {};
    const searchEmail = searchEmailTerm ? { email: { $regex: new RegExp(searchEmailTerm, "i") } } : {};

    const filter = { ...searchLogin, ...searchEmail };

    const totalCount = await usersCollections.countDocuments(filter);

    const pagesCount = Math.ceil(totalCount / pageSize);

    const items = await usersCollections
      .find(filter)
      .sort({
        [sortBy]: TypeSortAskDesk[sortDirection],
      })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .toArray();

    const filterItems = items.map((item) => {
      const id = item._id.toString();
      return {
        id,
        login: item.login,
        email: item.email,
        createdAt: item.createdAt,
      };
    });

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      filterItems,
    };
  },

  async findUserById(id: string) {
    return await usersCollections.findOne({ _id: new ObjectId(id) });
  },

  async findUserByLoginOrEmail(loginOrEmail: string) {
    return await usersCollections.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  },
};
