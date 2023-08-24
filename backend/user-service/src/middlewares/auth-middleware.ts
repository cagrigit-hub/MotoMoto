// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { validateAccessToken } from '../utils/auth-utils';


declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.header('Authorization');
  const token = auth?.split(' ')[1];
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
  // set req.user 
  req.user = decoded;
  
  // Token is valid, continue to the next middleware/route handler
  next();
};
