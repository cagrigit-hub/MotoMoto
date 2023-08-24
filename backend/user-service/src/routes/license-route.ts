import express from 'express';
import { verifyLicense } from '../controllers/license-controller';
import { isAdminMiddleware } from 'src/middlewares/is-admin-middleware';

const router = express.Router();

// Route for verifying a user's license (accessible by admin)
router.post('/verify/:userId', isAdminMiddleware ,verifyLicense);

export default router;