import nodemailer from "nodemailer";

export const emailAdapter = {
  async sendEmail(email: string, subject: string, message: string) {
    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "email gmail",
        pass: "pass gmail",
      },
    });

    let info = await transport.sendMail({
      from: "Back <email>",
      to: email,
      subject: subject,
      html: message,
    });
    return info;
  },
};
