// controllers/LicenseController.ts
import { Request, Response } from 'express';
import LicenseService from '../services/license-service'; // Import your LicenseService

export const verifyLicense = async (req: Request, res: Response) => {
  const { userId } = req.params; // Assuming the user ID is passed as a parameter
  const { isAdmin } = req.user; // Assuming you have middleware that populates the user object

  if (!isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    // Call the LicenseService function to verify the license
    await LicenseService.verifyUserLicense(userId);

    res.status(200).json({ message: 'License verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while verifying the license' });
  }
};