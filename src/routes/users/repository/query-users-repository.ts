import { ObjectId, WithId } from "mongodb";
import { usersCollections } from "../../../setting";
import { TypeSortAskDesk, UserDatabase } from "../../../types";

export const userQueryRepository = {
  async findAllUsers({ searchLoginTerm = "", searchEmailTerm = "", sortBy = "createdAt", sortDirection = "desc", pageNumber = 1, pageSize = 10 }) {
    const filter = {
      $or: [{ login: { $regex: new RegExp(searchLoginTerm, "i") } }, { email: { $regex: new RegExp(searchEmailTerm, "i") } }],
    };

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
        login: item.accountData.login,
        email: item.accountData.email,
        createdAt: item.accountData.createdAt,
      };
    });

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: filterItems,
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

  async findUserByLogin(login: string) {
    return await usersCollections.findOne({ login: login });
  },

  async findUserByEmail(email: string) {
    return await usersCollections.findOne({ email: email });
  },

  async findUserByConfirmToken(code: string): Promise<WithId<UserDatabase> | null> {
    const userByToken = await usersCollections.findOne({ "emailConfirmation.confirmationCode": code });
    if (!userByToken) return null;
    return userByToken;
  },
};
