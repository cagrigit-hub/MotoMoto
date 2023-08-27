import { ServerError, UserPayload, KafkaProducer } from '@cakitomakito/moto-moto-common';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import MotorService from '../services/motor-service';

export const createMotor = async (req: Request, res: Response) => {
    if(!validationResult(req).isEmpty()) {
        const r = validationResult(req);
        // return errors object inside of r as a string
        const errors = r.array().map((err) => err.msg).join(', ');
    
        throw new ServerError(errors);
      }
      const currentUser = req.user;
      const { name, description, model, year, image, status } = req.body;
      try {
        const motor = await MotorService.createMotor(name, description, model, year, image, status, currentUser!.userId);
        const producer = new KafkaProducer(["localhost:29092"]);
        await producer.send("motor-events", {
            type: "motor-created",
            data: motor
        })
        await producer.disconnect();
        res.status(201).send(motor);
    } catch (error) {
        throw error
      }
}

export const getMotorById = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
        const motor = await MotorService.getMotorById(id);
        res.status(200).send(motor);
    } catch (error) {
        throw error
    }
}

export const updateMotorById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) {
        throw new ServerError('Id is required');
    }
    // whole motor can be updated, given body will be used as a partial

    const currentUser = req.user as UserPayload;
    try {
        const motor = await MotorService.updateMotorById(id,currentUser, req.body);
        res.status(200).send(motor);
    }
    catch (error) {
        throw error
    }
}

export const deleteMotorById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) {
        throw new ServerError('Id is required');
    }
    try {
        
        const user = req.user as UserPayload;
        const motor = await MotorService.deleteMotorById(id,user);
        res.status(200).send(motor);
    }
    catch (error) {
        throw error
    }
}

export const getMotors = async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    if(parseInt(page as string) <= 0) {
        throw new ServerError('Page must be greater than 0');
    }
    try {
        const motors = await MotorService.getMotors(
            parseInt(page as string),
            parseInt(limit as string)
        );
        res.status(200).send(motors);
    } catch (error) {
        throw error
    }
}
