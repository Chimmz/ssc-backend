import nodemailer, { TransportOptions } from 'nodemailer';
import { UserDocument } from '../types';

class EmailService {
  #transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'login', // default
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD
    }
  } as TransportOptions);

  async sendVerificationEmail(user: UserDocument, link: string) {
    const options = {
      from: 'Seoul Startups Club',
      to: user.email,
      subject: 'Confirm your account on Seoul Startups Club',
      html: `
        <div>
          <p>Dear ${user.firstName},</p>
          <p>Thank you for joining us at Seoul Startups Club!</p>
          <p style="margin-bottom: 10px">To complete the registration process, please verify your account by clicking the link below.</p>
          <a href='${link}' style="background: #7600ff; color: #fff; padding: 7px 15px; border-radius: 999px; text-align: center;">Verify My Account</a>
        </div>
      `
    };
    const feedback = (await this.#transporter.sendMail(options)) as { accepted: string[] };
    console.log(feedback);
    return { successful: !!feedback.accepted.length };
  }

  // async sendEmailVerificationCode(toEmail: string, code: string) {
  //   const options = {
  //     from: 'Seoul Startups Club',
  //     to: toEmail,
  //     subject: 'Verify your Email',
  //     html: `<p>Please use the verification code below to continue the registration process. </p><br/>${code
  //       .toString()
  //       .split('')
  //       .join(' ')}`
  //   };
  //   const feedback = await this.#transporter.sendMail(options);
  //   return feedback;
  // }

  async sendEmailVerificationLinkForPasswordReset(email: string, link: string) {
    const options = {
      from: 'Seoul Startups Club',
      to: email,
      subject: 'Reset your Password',
      html: `<p>Please click the link below to reset your password.</p><br/>${link}`
    };
    const feedback = await this.#transporter.sendMail(options);
    return feedback;
  }
}

export default new EmailService();
