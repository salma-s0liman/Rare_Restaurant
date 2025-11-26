import { EventEmitter } from "node:events";
import Mail from "nodemailer/lib/mailer";
import { sendEmail } from "./send.email";
import { verifyEmail } from "./verify.template.email";

export const emailEvent = new EventEmitter();

export interface IEmail extends Mail.Options {
  otp: string;
  email: string;
}

emailEvent.on("ConfirmEmail", async (data: IEmail) => {
  try {
    data.subject = "ConfirmEmail";
    data.html = verifyEmail({ code: data.otp, title: data.subject });
    await sendEmail({
      to: data.email,
      subject: data.subject,
      html: data.html,
    });
    console.log(`Email sent successfully to ${data.email}`);
  } catch (error) {
    console.log(`Fail to send email`, error);
  }
});
