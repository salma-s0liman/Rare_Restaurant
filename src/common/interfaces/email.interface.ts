import Mail from "nodemailer/lib/mailer";

export interface IEmail extends Mail.Options {
  otp: string;
  email: string;
}