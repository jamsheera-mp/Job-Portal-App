import { IEmailService } from '../../domain/interfaces/services/emailService';
import * as nodemailer from 'nodemailer';

export class EmailServiceImpl implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Job Portal',
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}