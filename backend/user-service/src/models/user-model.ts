// models/UserModel.ts
import mongoose, { Document, Schema, mongo } from 'mongoose';

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  drivingLicense: mongoose.Types.ObjectId;
  isAdmin: boolean;
}

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  drivingLicense: { type: Schema.Types.ObjectId, ref: 'DrivingLicense' },
  isAdmin: { type: Boolean, default: false },
});

export default mongoose.model<User>('User', userSchema);
