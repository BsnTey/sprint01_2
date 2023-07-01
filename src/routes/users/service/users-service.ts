import { UserDatabaseOutput } from '../../../types';
import { generateHash } from '../../../utils';
import { userCqrsRepository } from '../repository/users-repository';
import { userQueryRepository } from '../repository/query-users-repository';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';

export const usersService = {
  async createUser(
    login: string,
    email: string,
    password: string,
    needCofirmed = false
  ): Promise<string | null> {
    const passwordSalt = await bcrypt.genSalt(14);
    const passwordHash = await generateHash(password, passwordSalt);

    const user = {
      accountData: {
        login,
        email,
        passwordHash,
        passwordSalt,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: needCofirmed,
      },
      refreshTokens: [],
    };

    const resId = await userCqrsRepository.insertUser(user);
    if (!resId) return null;
    return resId.toString();
  },

  async getUserById(userId: string): Promise<UserDatabaseOutput | null> {
    const findUser = await userQueryRepository.findUserById(userId);
    if (!findUser) return null;
    return {
      login: findUser.accountData.login,
      email: findUser.accountData.email,
      createdAt: findUser.accountData.createdAt,
      id: findUser._id.toString(),
    };
  },

  async deleteUser(id: string): Promise<boolean> {
    return await userCqrsRepository.deleteUser(id);
  },
};
