import { User } from '../../entities/user';

export interface IUserRepository {
  create(user: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  findByLinkedInId(linkedinId: string): Promise<User | null>;
  update(id: string, userData: Partial<User>): Promise<User>;
}