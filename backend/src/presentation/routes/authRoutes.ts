import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/authController';
import { RegisterUseCase } from '../../application/auth/register';
import { SendOtpUseCase } from '../../application/auth/sendOtp';
import { VerifyOtpUseCase } from '../../application/auth/verifyOtp';
import { ForgotPasswordUseCase } from '../../application/auth/forgotPassword';
import { ResetPasswordUseCase } from '../../application/auth/resetPassword';
import { LoginUseCase } from '../../application/auth/login';
import { UserRepositoryImpl } from '../../infrastructure/repositories/userRepositoryImpl';
import { OtpRepositoryImpl } from '../../infrastructure/repositories/otpRepositoryImpl';
import { EmailServiceImpl } from '../../infrastructure/services/emailServiceImpl';
import { AuthServiceImpl } from '../../infrastructure/services/authServiceImpl';
import { authMiddleware } from '../../infrastructure/middleware/authMiddleware';

const router = Router();

const userRepo = new UserRepositoryImpl();
const otpRepo = new OtpRepositoryImpl();
const emailService = new EmailServiceImpl();
const authService = new AuthServiceImpl();
const registerUseCase = new RegisterUseCase(userRepo, otpRepo, emailService, authService);
const sendOtpUseCase = new SendOtpUseCase(userRepo, otpRepo, emailService, authService);
const verifyOtpUseCase = new VerifyOtpUseCase(userRepo, otpRepo);
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepo, otpRepo, emailService, authService);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepo, otpRepo, authService);
const loginUseCase = new LoginUseCase(userRepo, authService);
const authController = new AuthController(
  registerUseCase,
  sendOtpUseCase,
  verifyOtpUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  loginUseCase
);

// Public routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));

// Social login routes (public)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/callback/google',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user as any;
    const token = authService.generateToken(user);
    res.status(200).json({ user, token });
  }
);

router.get('/linkedin', passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] }));
router.get(
  '/callback/linkedin',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user as any;
    const token = authService.generateToken(user);
    res.status(200).json({ user, token });
  }
);

// Protected routes
router.post('/send-otp', authMiddleware, (req, res) => authController.sendOtp(req, res));
router.post('/verify-otp', authMiddleware, (req, res) => authController.verifyOtp(req, res));
router.post('/reset-password', authMiddleware, (req, res) => authController.resetPassword(req, res));

export default router;