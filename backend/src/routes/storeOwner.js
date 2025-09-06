import express from 'express';
import StoreOwnerController from '../controllers/storeOwnerController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// All store owner routes require authentication and store_owner role
router.use(authenticateToken);
router.use(requireRole(['store_owner']));

// Store owner dashboard
router.get('/ratings', StoreOwnerController.getStoreRatings);
router.get('/stats', StoreOwnerController.getStoreStats);

export default router;
