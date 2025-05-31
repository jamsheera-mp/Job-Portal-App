import { IUserRepository } from '../../domain/interfaces/repositories/userRepository';
import { User } from '../../domain/entities/user';
import { UserModel } from '../database/mongoose/schemas/userSchema';

export class UserRepositoryImpl implements IUserRepository {
  async create(user: Partial<User>): Promise<User> {
    return await UserModel.create(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email }).lean();
  }

  async findById(id: string): Promise<User | null> {
    return await UserModel.findById(id).lean();
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return await UserModel.findOne({ googleId }).lean();
  }

  async findByLinkedInId(linkedinId: string): Promise<User | null> {
    return await UserModel.findOne({ linkedinId }).lean();
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    return await UserModel.findByIdAndUpdate(id, userData, { new: true }).lean();
  }
}