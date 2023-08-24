import { Request, Response } from 'express';
import LicenseService from '../services/license-service'; // Import your LicenseService
import ServerError from 'src/errors/server-error';

export const verifyLicense = async (req: Request, res: Response) => {
  const { userId } = req.params; // Assuming the user ID is passed as a parameter

  try {
    // Call the LicenseService function to verify the license
    await LicenseService.verifyUserLicense(userId);

    res.status(200).json({ message: 'License verified successfully' });
  } catch (error) {
    throw new ServerError('An error occurred while verifying the license');
  }
};