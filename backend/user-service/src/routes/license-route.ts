import express from 'express';
import { getLicense, getLicenseByUser, uploadLicense, verifyLicense } from '../controllers/license-controller';
import { isAdminMiddleware } from '@cakitomakito/moto-moto-common';
import { currentUser } from '@cakitomakito/moto-moto-common';
import { validateGetLicense, validateLicenseUpload } from '../validations/licenseValidations';

const router = express.Router();

// Route for verifying a user's license (accessible by admin)
router.post('/verify/:userId', currentUser, isAdminMiddleware ,verifyLicense);

// Update a license
router.post('/upload', validateLicenseUpload ,currentUser, uploadLicense);

// Get a license by user id
router.get('/user/:userId', currentUser, getLicenseByUser);

// Get a license by license id
router.get('/:licenseId', validateGetLicense, currentUser, getLicense);

export default router;