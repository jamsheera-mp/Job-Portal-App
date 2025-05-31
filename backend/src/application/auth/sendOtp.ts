import { IUserRepository } from '../../domain/interfaces/repositories/userRepository';
import { IOtpRepository } from '../../domain/interfaces/repositories/otpRepository';
import { IEmailService } from '../../domain/interfaces/services/emailService';
import { IAuthService } from '../../domain/interfaces/services/authService';

export class SendOtpUseCase {
  constructor(
    private userRepo: IUserRepository,
    private otpRepo: IOtpRepository,
    private emailService: IEmailService,
    private authService: IAuthService
  ) {}

  async execute(userId: string, type: 'emailVerification' | 'passwordReset'): Promise<void> {
    // Check if user exists
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new OTP
    const otp = this.authService.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    // Delete any existing OTP for this user and type
    await this.otpRepo.deleteByUserIdAndType(userId, type);

    // Store new OTP
    await this.otpRepo.create({
      userId,
      otp,
      type,
      expiresAt,
    });

    // Send OTP
    await this.emailService.sendOtp(user.email, otp);
  }
}