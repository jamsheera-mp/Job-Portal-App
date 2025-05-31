import { User } from '../../entities/user';

export interface IAuthService {
  generateOtp(): string;
  hashPassword(password: string): Promise<string>;
  generateToken(user: User): string;
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
}