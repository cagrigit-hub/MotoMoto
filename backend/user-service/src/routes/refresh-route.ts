// routes/authRoutes.ts
import express from 'express';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt';
import { authMiddleware } from '../middlewares/auth-middleware';
const router = express.Router();

// Route for token refresh
router.post('/', authMiddleware,(req, res) => {
  const refresh_token = req.body.refresh_token; // Get the refresh token from the request body

  // Verify the refresh token
  jwt.verify(refresh_token, jwtConfig.refreshSecret, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate a new access token using the user's ID (or any other unique identifier)
    const new_access_token = jwt.sign({ userId: decoded.userId }, jwtConfig.accessSecret, {
      expiresIn: jwtConfig.accessExpiresIn,
    });

    res.json({ access_token: new_access_token });
  });
});

export default router;
