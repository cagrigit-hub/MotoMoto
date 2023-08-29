import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { InvalidCredentials, MOTOR_CREATED, MOTOR_EVENTS, USER_CREATED, USER_EVENTS } from '@cakitomakito/moto-moto-common';
import UserService from '../services/user-service';
import { KafkaProducer } from '@cakitomakito/moto-moto-common';

export const registerUser = async (req: Request, res: Response) => {
  if(!validationResult(req).isEmpty()) {
    const r = validationResult(req);
    // return errors object inside of r as a string
    const errors = r.array().map((err) => err.msg).join(', ');

    throw new InvalidCredentials(errors);
  }
  const { username, email, password } = req.body;
 
  try {
    // Hash the password
    // salt the password
    const salt = await bcrypt.genSalt(10);
    // hash the password
    const hashedPassword = await bcrypt.hash(password, salt);
    // append salt to password
    const saltedPassword = `${salt}-${hashedPassword}`;
    const user = await UserService.registerUser(username, email, saltedPassword);
    // send a message to kafka
    const producer = new KafkaProducer(["localhost:29092"]);
    try {
      await producer.send(USER_EVENTS, {
        type: USER_CREATED,
        data: user
      })
    } catch (error) {
      // revert the user creation
      await UserService.deleteUser({userId: "1", isAdmin: true},user._id);
      throw error;
    }
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error : any) {
    // get this error and convert it to LoginError
    throw error;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  if(!validationResult(req).isEmpty()) {
    throw new InvalidCredentials('Invalid request body');
  }
  const { email, password } = req.body;
  
  try {
    const { accessToken, refreshToken } = await UserService.loginUser(email, password);
      // set also a cookie for server side rendering
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.status(200).json({ accessToken, refreshToken });
  } catch (error : any) {
    throw error;
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await UserService.getUser(userId);
    res.status(200).json(user);
  } catch (error : any) {
    throw error;
  }
}
