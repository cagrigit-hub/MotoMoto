// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { validateAccessToken } from '../utils/auth-utils';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token || !validateAccessToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify the token's expiration date
  const decoded = jwt.decode(token) as JwtPayload;
  const tokenExpiration = decoded?.exp || 0;
  const currentTime = Math.floor(Date.now() / 1000);

  // If the token is about to expire, send a response indicating the need for a refresh
  if (tokenExpiration - currentTime < 60) {
    return res.status(401).json({ error: 'Token about to expire', refresh_token_required: true });
  }

  // Token is valid, continue to the next middleware/route handler
  next();
};
