import { UserDatabaseOutput } from "../../types";
import { CreateUserDto } from "../users.dto";
import { generateHash } from "../../utils";
import { userCqrsRepository } from "../repository/users-repository";
import { userQueryRepository } from "../repository/query-users-repository";
import * as bcrypt from "bcrypt";

export const usersService = {
  async createUser(bodyParams: CreateUserDto): Promise<UserDatabaseOutput | null> {
    const passwordSalt = await bcrypt.genSalt(14);
    const passwordHash = await generateHash(bodyParams.password, passwordSalt);

    const user = {
      login: bodyParams.login,
      email: bodyParams.email,
      passwordHash,
      passwordSalt,
      createdAt: new Date().toISOString(),
    };

    const resId = await userCqrsRepository.insertUser(user);

    if (resId) {
      const findUser = await userQueryRepository.findUserById(resId.toString());
      if (!findUser) return null;
      return {
        login: findUser.login,
        email: findUser.email,
        createdAt: findUser.createdAt,
        id: findUser._id.toString(),
      };
    }
    return null;
  },
  async deleteUser(id: string): Promise<boolean> {
    return await userCqrsRepository.deleteUser(id);
  },
};
