import Motor, {Motor as MT, MotorStatus} from "../models/motor-model";
import { FailedError, NotFound, UnauthorizedError, UserPayload } from "@cakitomakito/moto-moto-common";
class MotorService {
    static async createMotor(name : string, description: string, model: string, year: number, image: string, status: MotorStatus, ownerId: string) {
        try {
            const newMotor = new Motor({
                name,
                description,
                model,
                year,
                image,
                status,
                owner: ownerId
            });
            return await newMotor.save();
        } catch (error: any) {
            throw new FailedError('Failed to create motor ' + error.message);
        }
    }

    static async getMotorById(id: string) {
        try {
            const motor = await Motor.findById(id);
            if (!motor) {
                throw new NotFound('Motor not found');
            }
            return motor;
        } catch (error: any) {
            throw new FailedError('Failed to get motor by id ' + error.message);
        }
    }
    static async updateMotorById(id: string,operator: UserPayload, motor: Partial<MT>) {
        try {
            const motorx = await Motor.findByIdAndUpdate(id, motor, {new: true});
            if (!motorx) {
                throw new NotFound('Motor not found');
            }
            if(motorx.owner.toString() !== operator.userId && !operator.isAdmin) {
                throw new UnauthorizedError('You are not allowed to update this motor');
            }
            if(motor.status === 'deleted') {
                throw new NotFound('Motor not found');
            }
            return motorx;
        } catch (error: any) {
            throw new FailedError('Failed to update motor by id ' + error.message);
        }
    }
    static async deleteMotorById(id: string, operator: UserPayload) {
        // dont delete just set status to deleted
        try {
            const motor = await Motor.findById(id);
            if (!motor) {
                throw new NotFound('Motor not found');
            }
            if(motor.owner.toString() !== operator.userId && !operator.isAdmin) {
             
                throw new UnauthorizedError('You are not allowed to delete this motor ');
            }
            motor.status = MotorStatus.Deleted;
            await motor.save();
            return motor;
        }
        catch (error: any) {
            throw new FailedError('Failed to delete motor by id ' + error.message);
        }
        
    }
    static async getMotors(page: number, limit: number) {
        try {
            const motors = await Motor.find({}).skip((page - 1) * limit).limit(limit);
            return motors;
        } catch (error: any) {
            throw new FailedError('Failed to get motors ' + error.message);
        }
    }
}

export default MotorService;