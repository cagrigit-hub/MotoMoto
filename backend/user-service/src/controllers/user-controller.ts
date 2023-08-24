// controllers/UserController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user-model';
import jwtConfig from '../config/jwt';

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      // Save the user to the database
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while registering the user' });
    }
  };

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists and password is valid
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
};
