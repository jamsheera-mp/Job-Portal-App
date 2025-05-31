export interface Otp {
  _id?: string;
  userId: string;
  otp: string;
  type: 'emailVerification' | 'passwordReset';
  expiresAt: Date;
  createdAt: Date;
}