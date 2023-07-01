import { ObjectId } from 'mongodb';
import { usersCollections } from '../../../setting';

export const authCqrsRepository = {
  async confirmEmail(code: string) {
    const result = await usersCollections.updateOne(
      { 'emailConfirmation.confirmationCode': code },
      { $set: { 'emailConfirmation.isConfirmed': true } }
    );
    return result.matchedCount === 1;
  },

  async reWriteEmailCode(userId: ObjectId, code: string) {
    const result = await usersCollections.updateOne(
      { _id: userId },
      { $set: { 'emailConfirmation.confirmationCode': code } }
    );
    return result.matchedCount === 1;
  },

  async saveToken(userId: ObjectId, refreshToken: string) {
    const resSave = await usersCollections.updateOne(
      { _id: userId },
      { $push: { 'tokenData.refreshTokens': refreshToken } }
    );
    return resSave.matchedCount === 1;
  },

  async removeToken(userId: ObjectId, refreshToken: string) {
    const resSave = await usersCollections.updateOne(
      { _id: userId },
      { $pull: { 'tokenData.refreshTokens': refreshToken } }
    );
    return resSave.matchedCount === 1;
  },
};
