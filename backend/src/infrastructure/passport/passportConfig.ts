import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { IUserRepository } from '../../domain/interfaces/repositories/userRepository';
import { User } from '../../domain/entities/user';

export const configurePassport = (userRepo: IUserRepository) => {
  // Serialize user
  passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });

  // Deserialize user
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await userRepo.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${process.env.CALLBACK_URL}/google`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userRepo.findByGoogleId(profile.id);
          if (!user) {
            const email = profile.emails?.[0]?.value || `${profile.id}@google.com`;
            const userData: Partial<User> = {
              email,
              googleId: profile.id,
              role: 'jobSeeker', // Default role
              isActive: true,
              isEmailVerified: true,
              profile: {
                name: profile.displayName || 'Google User',
                profilePictureUrl: profile.photos?.[0]?.value,
              },
            };
            user = await userRepo.create(userData);
          }
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  // LinkedIn Strategy
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID!,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
        callbackURL: `${process.env.CALLBACK_URL}/linkedin`,
        scope: ['r_emailaddress', 'r_liteprofile'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userRepo.findByLinkedInId(profile.id);
          if (!user) {
            const email = profile.emails?.[0]?.value || `${profile.id}@linkedin.com`;
            const userData: Partial<User> = {
              email,
              linkedinId: profile.id,
              role: 'jobSeeker', // Default role
              isActive: true,
              isEmailVerified: true,
              profile: {
                name: profile.displayName || 'LinkedIn User',
                profilePictureUrl: profile.photos?.[0]?.value,
              },
            };
            user = await userRepo.create(userData);
          }
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};