
import { Schema, model } from 'mongoose';
import { Otp } from '../../../../domain/entities/otp';

const OtpSchema = new Schema<Otp>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    otp: { type: String, required: true }, // 6 digit otp code
    type: { type: String, enum: ['emailVerification', 'passwordReset'], required: true },
    expiresAt: { type: Date, required: true, index: { expires: '0s' } }, // Auto-expire after 0 seconds past expiresAt - TTL
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const OtpModel = model<Otp>('Otp', OtpSchema);