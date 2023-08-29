
import DrivingLicense from '../models/driver-license'; 
import { CustomError } from '@cakitomakito/moto-moto-common';
import { NotLicensed } from '@cakitomakito/moto-moto-common';
import UserModel from '../models/user-model';
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
      // attach it to the user
      const user = await UserModel.findOne({ _id: userId });
      
      if (!user) {
        throw new Error('User not found');
      }
      user.drivingLicense = drivingLicense._id;
      await user.save();

    } catch (error: any) {
      throw new CustomError();
    }
  }
  static async getLicenseByUser(userId: string) {
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
  static async getLicenseById(licenseId: string) {
      try {
        const drivingLicense = await DrivingLicense.findOne({ _id: licenseId });
        if (!drivingLicense) {
          throw new Error('No driving license found');
        }
        return drivingLicense;
      } catch (error) {
      throw new NotLicensed("No driving license");

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
  static async getAllLicenses() {
    try {
      const drivingLicenses = await DrivingLicense.find();
      return drivingLicenses;
    } catch (error) {
      throw new NotLicensed("No driving licenses");
    }
  }
}

export default LicenseService;