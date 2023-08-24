import express from 'express';
import { getLicense, getLicenseByUser, uploadLicense, verifyLicense } from '../controllers/license-controller';
import { isAdminMiddleware } from '../middlewares/is-admin-middleware';
import { authMiddleware } from '../middlewares/auth-middleware';
import { validateGetLicense, validateLicenseUpload } from '../validations/licenseValidations';

const router = express.Router();

// Route for verifying a user's license (accessible by admin)
router.post('/verify/:userId', authMiddleware, isAdminMiddleware ,verifyLicense);

// Update a license
router.post('/upload', validateLicenseUpload ,authMiddleware, uploadLicense);

// Get a license by user id
router.get('/user/:userId', authMiddleware, getLicenseByUser);

// Get a license by license id
router.get('/:licenseId', validateGetLicense, authMiddleware, getLicense);

export default router;