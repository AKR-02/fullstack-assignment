import express from 'express';
import AuthController from '../controllers/authController.js';
import { validateRequest } from '../middlewares/zodValidation.js';
import { authenticateToken } from '../middlewares/auth.js';
import { 
  userRegistrationSchema, 
  userLoginSchema, 
  passwordUpdateSchema 
} from '../schemas/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRequest(userRegistrationSchema), AuthController.register);
router.post('/login', validateRequest(userLoginSchema), AuthController.login);

// Protected routes
router.use(authenticateToken);
router.get('/profile', AuthController.getProfile);
router.put('/password', validateRequest(passwordUpdateSchema), AuthController.updatePassword);

export default router;