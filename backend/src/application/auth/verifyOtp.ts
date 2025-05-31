import { IUserRepository } from '../../domain/interfaces/repositories/userRepository';
import { IOtpRepository } from '../../domain/interfaces/repositories/otpRepository';

export class VerifyOtpUseCase {
  constructor(
    private userRepo: IUserRepository,
    private otpRepo: IOtpRepository
  ) {}

  async execute(userId: string, otp: string, type: 'emailVerification' | 'passwordReset'): Promise<void> {
    // Find the OTP
    const storedOtp = await this.otpRepo.findByUserIdAndType(userId, type);
    if (!storedOtp) {
      throw new Error('OTP not found or expired');
    }

    // Verify OTP
    if (storedOtp.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    // Check expiration
    if (new Date() > storedOtp.expiresAt) {
      throw new Error('OTP has expired');
    }

    // If email verification, update user status
    if (type === 'emailVerification') {
      await this.userRepo.update(userId, { isEmailVerified: true });
    }

    // Delete the OTP
    await this.otpRepo.deleteByUserIdAndType(userId, type);
  }
}