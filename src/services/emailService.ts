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
        <div style="margin-bottom: 50px">
          <p>Dear ${user.firstName},</p>
          <p>Thank you for joining us at Seoul Startups Club!</p>
          <p style="margin-bottom: 30px">To complete the registration process, please verify your account by clicking the link below.</p>
          <a href="${link}" style="background: #7600ff; color: #fff; padding: 7px 15px; border-radius: 999px; text-align: center; text-decoration: none">Verify My Account</a>
        </div>
      `
    };
    const feedback = (await this.#transporter.sendMail(options)) as { accepted: string[] };
    console.log(feedback);
    return { successful: !!feedback.accepted.length };
  }

  async sendEmailVerificationLinkForPasswordReset(email: string, link: string) {}
}

export default new EmailService();
