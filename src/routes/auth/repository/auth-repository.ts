import { ObjectId } from "mongodb";
import { usersCollections } from "../../../setting";

export const authCqrsRepository = {
  async confirmEmail(code: string) {
    const result = await usersCollections.updateOne({ "emailConfirmation.confirmationCode": code }, { $set: { "emailConfirmation.isConfirmed": true } });
    return result.matchedCount === 1;
  },

  async reWriteEmailCode(userId: ObjectId, code: string) {
    const result = await usersCollections.updateOne({ _id: userId }, { $set: { "emailConfirmation.confirmationCode": code } });
    return result.matchedCount === 1;
  },
};
