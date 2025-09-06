import express from 'express';
import UserController from '../controllers/userController.js';
import { validateRequest, validateQuery } from '../middlewares/zodValidation.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';
import { ratingSubmissionSchema, userStoreQuerySchema } from '../schemas/validation.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);
router.use(requireRole(['user', 'admin']));

// Store browsing and rating
router.get('/stores', validateQuery(userStoreQuerySchema), UserController.getStores);
router.post('/ratings', validateRequest(ratingSubmissionSchema), UserController.submitRating);
router.put('/ratings', validateRequest(ratingSubmissionSchema), UserController.updateRating);
router.get('/ratings', UserController.getUserRatings);

export default router;