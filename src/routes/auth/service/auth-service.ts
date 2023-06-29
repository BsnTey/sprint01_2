import { jwtService } from "../../../application/jwtService";
import { ResultJwtCreate } from "../../../types";
import { userQueryRepository } from "../../users/repository/query-users-repository";
import { generateHash } from "../../../utils";

export const authService = {
  async loginUser(loginOrPass: string, password: string): Promise<boolean | ResultJwtCreate> {
    const user = await userQueryRepository.findUserByLoginOrEmail(loginOrPass);
    if (!user) return false;
    const passwordHash = await generateHash(password, user.passwordSalt);
    if (user.passwordHash !== passwordHash) return false;
    const token = await jwtService.createJwt(user);
    return token;
  },
};
