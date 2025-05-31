export interface User {
  _id?: string;
  email: string;
  password?: string;
  role: 'jobSeeker' | 'recruiter' | 'admin';
  isActive: boolean;
  isEmailVerified: boolean;
  googleId?: string;
  linkedinId?: string;
  profile: {
    name: string;
    bio?: string;
    phone?: string;
    profilePictureUrl?: string;
  };
  jobSeekerProfile?: {
    skills?: string[];
    resumeUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    experience?: { company: string; role: string; years: number }[];
  };
  recruiterProfile?: {
    company?: {
      name?: string;
      logoUrl?: string;
      description?: string;
      website?: string;
      industry?: string;
      location?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}