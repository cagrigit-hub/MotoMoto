import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import ServerError from '../errors/server-error';
import UserService from '../services/user-service';
import RegisterError from '../errors/register-error';
import LoginError from '../errors/login-error';

export const registerUser = async (req: Request, res: Response) => {
  if(!validationResult(req).isEmpty()) {
    const r = validationResult(req);
    // return errors object inside of r as a string
    const errors = r.array().map((err) => err.msg).join(', ');

    throw new ServerError(errors);
  }
  const { username, email, password } = req.body;
 
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    await UserService.registerUser(username, email, hashedPassword);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error : any) {
    // get this error and convert it to LoginError
    throw new RegisterError(error.message)
  }
};

export const loginUser = async (req: Request, res: Response) => {
  if(!validationResult(req).isEmpty()) {
    throw new ServerError('Invalid request body');
  }
  const { email, password } = req.body;
  
  try {
    const { accessToken, refreshToken } = await UserService.loginUser(email, password);
    res.status(200).json({ accessToken, refreshToken });
  } catch (error : any) {
    throw new LoginError(error.message);
  }
};
