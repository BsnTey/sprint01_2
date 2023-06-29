import { jwt_secret } from "../constant";
import { UserDatabase } from "../types";
import jwt from "jsonwebtoken";
import { ResultJwtCreate } from "../types";

export const jwtService = {
  async createJwt(user: UserDatabase): Promise<ResultJwtCreate> {
    const token = jwt.sign({ userId: user._id.toString() }, jwt_secret, { expiresIn: "1h" });
    return {
      accessToken: token,
    };
  },

  async getUserByToken(token: string) {
    try {
      const result: any = jwt.verify(token, jwt_secret);
      return result.userId;
    } catch (err) {
      return null;
    }
  },
};
