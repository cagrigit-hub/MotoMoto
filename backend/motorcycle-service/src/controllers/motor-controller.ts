import { ServerError, UserPayload } from '@cakitomakito/moto-moto-common';
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
    // only description, image, status can be updated
    const { description, image, status } = req.body;
    const currentUser = req.user as UserPayload;
    try {
        const motor = await MotorService.updateMotorById(id,currentUser, {description, image, status});
        res.status(200).send(motor);
    }
    catch (error) {
        throw error
    }
}

export const deleteMotorById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        
        const user = req.user;
        console.log(user)
        const motor = await MotorService.deleteMotorById(id,user);
        res.status(200).send(motor);
    }
    catch (error) {
        throw error
    }
}

export const getMotors = async (req: Request, res: Response) => {
    const { page, limit } = req.query;
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
