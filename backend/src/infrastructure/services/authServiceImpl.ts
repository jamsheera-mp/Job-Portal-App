import { IAuthService } from '../../domain/interfaces/services/authService';
import { User } from '../../domain/entities/user';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

export class AuthServiceImpl implements IAuthService {
  private readonly jwtSecret: string = process.env.JWT_SECRET || 'your-secret';

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  generateToken(user: User): string {
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      this.jwtSecret,
      { expiresIn: '1h' }
    );
  }
}