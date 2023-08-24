// routes/UserRoutes.ts
import express from 'express';
import { registerUser, loginUser, getUser } from '../controllers/user-controller';
import { loginValidation, registerValidation } from '../validations/authValidations';
import { authMiddleware } from '../middlewares/auth-middleware';

const router = express.Router();



// Register user route
router.post('/register', registerValidation, registerUser);

// Login user route
router.post('/login', loginValidation, loginUser);

// Get user route
router.get('/:userId', authMiddleware, getUser);

export default router;
