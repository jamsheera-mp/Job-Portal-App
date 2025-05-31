import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret';
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (error: any) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};