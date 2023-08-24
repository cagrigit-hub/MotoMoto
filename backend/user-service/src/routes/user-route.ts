// routes/UserRoutes.ts
import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser } from '../controllers/user-controller';

const router = express.Router();

// Validation middleware for registering a user
const registerValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Validation middleware for logging in a user
const loginValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Register user route
router.post('/register', registerValidation, registerUser);

// Login user route
router.post('/login', loginValidation, loginUser);

export default router;
