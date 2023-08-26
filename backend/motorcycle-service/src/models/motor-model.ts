// models/UserModel.ts
import mongoose, { Document, Schema } from 'mongoose';

export enum MotorStatus {
    Available = 'available',
    Unavailable = 'unavailable',
    Reserved = 'reserved',
    Rented = 'rented',
    Deleted = 'deleted'
}

export interface Motor extends Document {
    name: string;
    description: string;
    model: string;
    year: number;
    image: string;
    status: MotorStatus;
    owner: Schema.Types.ObjectId;
}
const motorSchema = new Schema<Motor>({
    name: { type: String, required: true, minlength: 3, maxlength: 20 },
    description: { type: String, required: true, minlength: 3, maxlength: 100 },
    model: { type: String, required: true, minlength: 3, maxlength: 20 },
    year: { type: Number, required: true, min: 1900, max: 2021 },
    image: { type: String, required: true },
    status: { type: String, enum: Object.values(MotorStatus), default: MotorStatus.Available },
    owner: { type: Schema.Types.ObjectId, required: true },
})
  

export default mongoose.model<Motor>('Motor', motorSchema);
