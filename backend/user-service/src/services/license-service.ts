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
  static async createLicense(userId: string, licenseNumber: string) {
    try {
      // Create a new driving license
      const drivingLicense = new DrivingLicense({
        userId,
        licenseNumber,
      });
      await drivingLicense.save();
    } catch (error: any) {
      throw new CustomError();
    }
  }
  static async getLicense(userId: string) {
    try {
      // Find the user's driving license
      const drivingLicense = await DrivingLicense.findOne({ userId });
      if (!drivingLicense) {
        throw new Error('User does not have a driving license');
      }
      return drivingLicense;
    } catch (error) {
      throw new NotLicensed("User does not have a driving license");
    }
  }
  static async deleteLicense(userId: string) {
    try {
      // Find the user's driving license
      const drivingLicense = await DrivingLicense.findOne({ userId });
      if (!drivingLicense) {
        throw new Error('User does not have a driving license');
      }
      await drivingLicense.deleteOne(
        { userId }
      );
    } catch (error) {
      throw new NotLicensed("User does not have a driving license");
    }
  }
  
}

export default LicenseService;