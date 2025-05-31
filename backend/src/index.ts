import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './presentation/routes/authRoutes';
import { configurePassport } from './infrastructure/passport/passportConfig';
import { UserRepositoryImpl } from './infrastructure/repositories/userRepositoryImpl';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/job-portal';

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET || 'my-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport
const userRepo = new UserRepositoryImpl();
configurePassport(userRepo);

// Routes
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});