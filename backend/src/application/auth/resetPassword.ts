import { IUserRepository } from '../../domain/interfaces/repositories/userRepository';
import { IOtpRepository } from '../../domain/interfaces/repositories/otpRepository';
import { IAuthService } from '../../domain/interfaces/services/authService';

export class ResetPasswordUseCase {
  constructor(
    private userRepo: IUserRepository,
    private otpRepo: IOtpRepository,
    private authService: IAuthService
  ) {}

  async execute(userId: string, otp: string, newPassword: string): Promise<void> {
    // Verify OTP
    const storedOtp = await this.otpRepo.findByUserIdAndType(userId, 'passwordReset');
    if (!storedOtp) {
      throw new Error('OTP not found or expired');
    }

    if (storedOtp.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    if (new Date() > storedOtp.expiresAt) {
      throw new Error('OTP has expired');
    }

    // Hash new password
    const hashedPassword = await this.authService.hashPassword(newPassword);

    // Update user's password
    await this.userRepo.update(userId, { password: hashedPassword });

    // Delete the OTP
    await this.otpRepo.deleteByUserIdAndType(userId, 'passwordReset');
  }
}