import DrivingLicense from '../models/driver-license'; 

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
      throw error;
    }
  }
}

export default LicenseService;