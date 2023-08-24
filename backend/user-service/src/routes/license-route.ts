import express from 'express';
import { verifyLicense } from '../controllers/license-controller';

const router = express.Router();

// Route for verifying a user's license (accessible by admin)
router.post('/verify/:userId', verifyLicense);

export default router;