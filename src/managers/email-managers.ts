import { emailAdapter } from "../adapters/email-adapter";
import { port } from "../constant";

export const emailManager = {
  async sendEmailRegister(email: string, confirmationCode: string) {
    const subject = "Complete registration";
    const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://localhost:${port}/confirm-email?code=${confirmationCode}'>complete registration</a>
        </p>`;

    try {
      const info = await emailAdapter.sendEmail(email, subject, message);
      console.log("info", info);

      if (info.accepted) return info.messageId;
    } catch (err) {
      console.log("error", err);
      return null;
    }
    return null;
  },
};
