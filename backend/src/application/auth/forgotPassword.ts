import { IUserRepository } from '../../domain/interfaces/repositories/userRepository';
import { IOtpRepository } from '../../domain/interfaces/repositories/otpRepository';
import { IEmailService } from '../../domain/interfaces/services/emailService';
import { IAuthService } from '../../domain/interfaces/services/authService';

export class ForgotPasswordUseCase {
  constructor(
    private userRepo: IUserRepository,
    private otpRepo: IOtpRepository,
    private emailService: IEmailService,
    private authService: IAuthService
  ) {}

  async execute(email: string): Promise<void> {
    // Check if user exists
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate OTP
    const otp = this.authService.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    // Delete any existing OTP for password reset
    await this.otpRepo.deleteByUserIdAndType(user._id!, 'passwordReset');

    // Store new OTP
    await this.otpRepo.create({
      userId: user._id!,
      otp,
      type: 'passwordReset',
      expiresAt,
    });

    // Send OTP
    await this.emailService.sendOtp(email, otp);
  }
}