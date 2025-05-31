import { Request, Response } from 'express';
import { RegisterUseCase } from '../../application/auth/register';
import { SendOtpUseCase } from '../../application/auth/sendOtp';
import { VerifyOtpUseCase } from '../../application/auth/verifyOtp';
import { ForgotPasswordUseCase } from '../../application/auth/forgotPassword';
import { ResetPasswordUseCase } from '../../application/auth/resetPassword';
import { LoginUseCase } from '../../application/auth/login';

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private sendOtpUseCase: SendOtpUseCase,
    private verifyOtpUseCase: VerifyOtpUseCase,
    private forgotPasswordUseCase: ForgotPasswordUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
    private loginUseCase: LoginUseCase
  ) {}

  async register(req: Request, res: Response) {
    try {
      const { email, password, role, name } = req.body;
      const user = await this.registerUseCase.execute(email, password, role, name);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.loginUseCase.execute(email, password);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async sendOtp(req: Request, res: Response) {
    try {
      const { userId, type } = req.body;
      await this.sendOtpUseCase.execute(userId, type);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const { userId, otp, type } = req.body;
      await this.verifyOtpUseCase.execute(userId, otp, type);
      res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await this.forgotPasswordUseCase.execute(email);
      res.status(200).json({ message: 'Password reset OTP sent successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { userId, otp, newPassword } = req.body;
      await this.resetPasswordUseCase.execute(userId, otp, newPassword);
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}