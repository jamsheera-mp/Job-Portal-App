import { User } from '../../domain/entities/user';
import { IUserRepository } from '../../domain/interfaces/repositories/userRepository';
import { IOtpRepository } from '../../domain/interfaces/repositories/otpRepository';
import { IEmailService } from '../../domain/interfaces/services/emailService';
import { IAuthService } from '../../domain/interfaces/services/authService';

export class RegisterUseCase {
  constructor(
    private userRepo: IUserRepository,
    private otpRepo: IOtpRepository,
    private emailService: IEmailService,
    private authService: IAuthService
  ) {}

  async execute(email: string, password: string, role: string, name: string): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await this.authService.hashPassword(password);

    // Create the new user
    const userData: Partial<User> = {
      email,
      password: hashedPassword,
      role: role as 'jobSeeker' | 'recruiter' | 'admin',
      isActive: true,
      isEmailVerified: false,
      profile: { name },
    };
    const user = await this.userRepo.create(userData);

    // Generate and store OTP
    const otp = this.authService.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
    await this.otpRepo.create({
      userId: user._id!,
      otp,
      type: 'emailVerification',
      expiresAt,
    });

    // Send OTP
    await this.emailService.sendOtp(email, otp);

    // Generate JWT token
    const token = this.authService.generateToken(user);

    // Add token to user object (not saved to DB)
    (user as any).token = token;

    return user;
  }
}