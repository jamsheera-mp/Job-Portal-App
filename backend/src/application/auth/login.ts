import { User } from '../../domain/entities/user';
import { IUserRepository } from '../../domain/interfaces/repositories/userRepository';
import { IAuthService } from '../../domain/interfaces/services/authService';

export class LoginUseCase {
  constructor(
    private userRepo: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(email: string, password: string): Promise<User> {
    // Find user by email
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    if (!user.password) {
      throw new Error('Invalid email or password');
    }
    const isPasswordValid = await this.authService.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new Error('Email not verified');
    }

    // Generate JWT token
    const token = this.authService.generateToken(user);

    // Add token to user object (not saved to DB)
    (user as any).token = token;

    return user;
  }
}