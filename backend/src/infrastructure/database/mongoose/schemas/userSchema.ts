import { Schema, model } from 'mongoose';
import { User } from '../../../../domain/entities/user';


// Define the UserSchema
const UserSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    role: { type: String, enum: ['jobSeeker', 'recruiter', 'admin'], required: true, index: true },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    googleId: { type: String, unique: true, sparse: true },
    linkedinId: { type: String, unique: true, sparse: true },

    // Common profile fields for all roles
    profile: {
      name: { type: String, required: true },
      bio: { type: String },
      phone: { type: String },
      profilePictureUrl: { type: String },
    },

    // Job seeker-specific details
    jobSeekerProfile: {
      skills: { type: [String], index: 'text' },
      resumeUrl: { type: String },
      githubUrl: { type: String },
      linkedinUrl: { type: String },
      experience: [
        {
          company: { type: String },
          role: { type: String },
          years: { type: Number },
        },
      ],
    },

    // Recruiter-specific details
    recruiterProfile: {
      company: {
        name: { type: String },
        logoUrl: { type: String },
        description: { type: String },
        website: { type: String },
        industry: { type: String },
        location: { type: String },
      },
    },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Update the updatedAt field before saving
UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Export the model
export const UserModel = model<User>('User', UserSchema);