import mongoose, { Document, Schema } from "mongoose";

export interface DrivingLicense extends Document {
  userId: mongoose.Types.ObjectId;
  licenseNumber: string;
  verified: boolean;
}

const drivingLicenseSchema = new Schema<DrivingLicense>({
  userId: { type: Schema.Types.ObjectId, required: true },
  licenseNumber: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

export default mongoose.model<DrivingLicense>(
  "DrivingLicense",
  drivingLicenseSchema
);
