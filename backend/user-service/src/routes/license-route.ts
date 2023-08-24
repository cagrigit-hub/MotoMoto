import express from 'express';
import { verifyLicense } from '../controllers/license-controller';
import { isAdminMiddleware } from '../middlewares/is-admin-middleware';
import { authMiddleware } from '../middlewares/auth-middleware';

const router = express.Router();

// Route for verifying a user's license (accessible by admin)
router.post('/verify/:userId', authMiddleware, isAdminMiddleware ,verifyLicense);

export default router;