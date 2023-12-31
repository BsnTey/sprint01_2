import { jwt_access_secret, jwt_refresh_secret } from "../constant";
import jwt from "jsonwebtoken";
import { ResultJwtCreate } from "../types";
import { authCqrsRepository } from "../routes/auth/repository/auth-repository";
import { ObjectId } from "mongodb";

export const jwtService = {
  async createJwt(payload: any): Promise<ResultJwtCreate> {
    const accessToken = jwt.sign(payload, jwt_access_secret, {
      expiresIn: 10,
    });
    const refreshToken = jwt.sign(payload, jwt_refresh_secret, {
      expiresIn: 20,
    });
    return {
      accessToken,
      refreshToken,
    };
  },

  async saveToken(userId: string, refreshToken: string): Promise<boolean> {
    return await authCqrsRepository.saveToken(new ObjectId(userId), refreshToken);
  },

  async getUserByToken(token: string) {
    try {
      const result: any = jwt.verify(token, jwt_access_secret);
      return result.id;
    } catch (err) {
      return null;
    }
  },
};
