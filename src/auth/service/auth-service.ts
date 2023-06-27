import { userQueryRepository } from "../../users/repository/query-users-repository";
import { generateHash } from "../../utils";

export const authService = {
  async loginUser(loginOrPass: string, password: string): Promise<boolean> {
    const user = await userQueryRepository.findUserByLoginOrEmail(loginOrPass);
    if (!user) return false;
    const passwordHash = await generateHash(password, user.passwordSalt);

    if (user.passwordHash !== passwordHash) return false;
    return true;
  },
};
