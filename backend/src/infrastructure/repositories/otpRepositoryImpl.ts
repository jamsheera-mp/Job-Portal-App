import { IOtpRepository } from '../../domain/interfaces/repositories/otpRepository';
import { Otp } from '../../domain/entities/otp';
import { OtpModel } from '../database/mongoose/schemas/otpSchema';

export class OtpRepositoryImpl implements IOtpRepository {
  async create(otp: Partial<Otp>): Promise<Otp> {
    return await OtpModel.create(otp);
  }

  async findByUserIdAndType(userId: string, type: string): Promise<Otp | null> {
    return await OtpModel.findOne({ userId, type }).lean();
  }

  async deleteByUserIdAndType(userId: string, type: string): Promise<void> {
    await OtpModel.deleteOne({ userId, type });
  }
}