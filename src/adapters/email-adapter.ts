import nodemailer from "nodemailer";
import { username_mailer, password_mailer } from "../constant";

export const emailAdapter = {
  async sendEmail(email: string, subject: string, message: string) {
    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: username_mailer,
        pass: password_mailer,
      },
    });

    let info = await transport.sendMail({
      from: `Back <${username_mailer}>`,
      to: email,
      subject: subject,
      html: message,
    });
    return info;
  },
};
