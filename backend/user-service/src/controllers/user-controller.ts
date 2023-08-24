import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import ServerError from 'src/errors/server-error';
import UserService from 'src/services/user-service';

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if(!validationResult(req).isEmpty()) {
    throw new ServerError('Invalid request body');
  }
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserService.registerUser(username, email, hashedPassword);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    throw new ServerError('An error occurred while registering the user');
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if(!validationResult(req).isEmpty()) {
    throw new ServerError('Invalid request body');
  }
  try {
    const { accessToken, refreshToken } = await UserService.loginUser(email, password);
    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    throw new ServerError('An error occurred while logging in');
  }
};
