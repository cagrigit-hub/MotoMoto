// routes/UserRoutes.ts
import express from 'express';
import { registerUser, loginUser } from '../controllers/user-controller';
import { loginValidation, registerValidation } from 'src/validations/authValidations';

const router = express.Router();



// Register user route
router.post('/register', registerValidation, registerUser);

// Login user route
router.post('/login', loginValidation, loginUser);

export default router;
