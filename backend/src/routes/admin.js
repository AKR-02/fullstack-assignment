import express from 'express';
import AdminController from '../controllers/adminController.js';
import { validateRequest, validateQuery } from '../middlewares/zodValidation.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';
import { 
  userRegistrationSchema, 
  storeSchema,
  userQuerySchema,
  storeQuerySchema
} from '../schemas/validation.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole(['admin']));

// Dashboard
router.get('/dashboard', AdminController.getDashboard);

// User management
router.post('/users', validateRequest(userRegistrationSchema), AdminController.createUser);
router.get('/users', validateQuery(userQuerySchema), AdminController.getAllUsers);
router.get('/users/:id', AdminController.getUserById);

// Store management
router.post('/stores', validateRequest(storeSchema), AdminController.createStore);
router.get('/stores', validateQuery(storeQuerySchema), AdminController.getAllStores);
router.get('/stores/:id', AdminController.getStoreById);

export default router;