import Error from '../errors/not-licensed';
import DrivingLicense from '../models/driver-license'; 
import { CustomError } from '../errors/custom-error';
import NotLicensed from '../errors/not-licensed';

class LicenseService {
  static async verifyUserLicense(userId: string) {
    try {
      // Find the user's driving license
      const drivingLicense = await DrivingLicense.findOne({ userId });
      if (!drivingLicense) {
        throw new Error('User does not have a driving license');
      }

      // Update the verification status of the driving license
      drivingLicense.verified = true;
      await drivingLicense.save();
    } catch (error) {
      throw new NotLicensed("User does not have a driving license");
    }
  }
}

export default LicenseService;