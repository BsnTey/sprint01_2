import { jwtService } from "../../../application/jwtService";
import { ResultJwtCreate, UserDatabase } from "../../../types";
import { userQueryRepository } from "../../users/repository/query-users-repository";
import { generateHash } from "../../../utils";
import { usersService } from "../../users/service/users-service";
import { emailManager } from "../../../managers/email-managers";
import { authCqrsRepository } from "../repository/auth-repository";
import { WithId } from "mongodb";
import { v4 as uuidv4 } from "uuid";

export const authService = {
  async registerUser(login: string, email: string, password: string): Promise<boolean> {
    const userId = await usersService.createUser(login, email, password);
    if (!userId) return false;

    const user = await userQueryRepository.findUserById(userId);
    if (!user) return false;

    const emailMess = await emailManager.sendEmailRegister(email, user.emailConfirmation.confirmationCode);
    if (!emailMess) return false;

    return true;
  },

  async loginUser(loginOrEmail: string, password: string): Promise<boolean | ResultJwtCreate> {
    const user = await userQueryRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    const passwordHash = await generateHash(password, user.accountData.passwordSalt);
    if (user.accountData.passwordHash !== passwordHash) return false;
    const token = await jwtService.createJwt(user);
    return token;
  },

  async confirmEmail(code: string): Promise<boolean> {
    const user = await userQueryRepository.findUserByConfirmToken(code);
    if (!user) return false;

    if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;

    return await authCqrsRepository.confirmEmail(code);
  },

  async reSendEmail(user: WithId<UserDatabase>): Promise<boolean> {
    const newCode = uuidv4();
    const emailMess = await emailManager.sendEmailRegister(user.accountData.email, newCode);
    if (!emailMess) return false;

    const reWriteRes = await authCqrsRepository.reWriteEmailCode(user._id, newCode);
    if (!reWriteRes) return false;

    return true;
  },
};
