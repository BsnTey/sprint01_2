import { jwtService } from '../../../application/jwtService';
import { ResultJwtCreate, UserDatabase } from '../../../types';
import { userQueryRepository } from '../../users/repository/query-users-repository';
import { generateHash } from '../../../utils';
import { usersService } from '../../users/service/users-service';
import { emailManager } from '../../../managers/email-managers';
import { authCqrsRepository } from '../repository/auth-repository';
import { ObjectId, WithId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

export const authService = {
  async registerUser(
    login: string,
    email: string,
    password: string
  ): Promise<boolean> {
    const userId = await usersService.createUser(login, email, password);
    if (!userId) return false;

    const user = await userQueryRepository.findUserById(userId);
    if (!user) return false;

    const emailMess = await emailManager.sendEmailRegister(
      email,
      user.emailConfirmation.confirmationCode
    );
    if (!emailMess) return false;
    return true;
  },

  async loginUser(
    loginOrEmail: string,
    password: string
  ): Promise<null | ResultJwtCreate> {
    const user = await userQueryRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) return null;
    const passwordHash = await generateHash(
      password,
      user.accountData.passwordSalt
    );

    if (user.accountData.passwordHash !== passwordHash) return null;
    const userId = user._id.toString();
    const tokens = await this.doTokens(userId);
    if (tokens) return tokens;
    return null;
  },

  async doTokens(userId: string): Promise<null | ResultJwtCreate> {
    const tokens = await jwtService.createJwt({
      id: userId,
    });
    const resSave = await jwtService.saveToken(userId, tokens.refreshToken);
    if (resSave) return tokens;
    return null;
  },

  async removeRefresh(userId: string, token: string): Promise<boolean> {
    return await authCqrsRepository.removeToken(new ObjectId(userId), token);
  },

  async confirmEmail(code: string): Promise<boolean> {
    return await authCqrsRepository.confirmEmail(code);
  },

  async reSendEmail(user: WithId<UserDatabase>): Promise<boolean> {
    const newCode = uuidv4();
    const emailMess = await emailManager.sendEmailRegister(
      user.accountData.email,
      newCode
    );

    if (!emailMess) return false;

    const reWriteRes = await authCqrsRepository.reWriteEmailCode(
      user._id,
      newCode
    );

    if (!reWriteRes) return false;

    return true;
  },
};
