import { Otp } from '../../entities/otp';

export interface IOtpRepository {
  create(otp: Partial<Otp>): Promise<Otp>;
  findByUserIdAndType(userId: string, type: string): Promise<Otp | null>;
  deleteByUserIdAndType(userId: string, type: string): Promise<void>;
}