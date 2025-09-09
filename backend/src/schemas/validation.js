import { z } from 'zod';

// Base schemas
const emailSchema = z.string().email('Please provide a valid email address');
const passwordSchema = z.string().trim()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/, 
    'Password must contain at least one uppercase letter and one special character');

const nameSchema = z.string()
  .min(5, 'Name must be at least 5 characters')
  .max(60, 'Name must be at most 60 characters');

const addressSchema = z.string()
  .max(400, 'Address must not exceed 400 characters');

const roleSchema = z.enum(['admin', 'user', 'store_owner'], {
  errorMap: () => ({ message: 'Role must be admin, user, or store_owner' })
});

const ratingSchema = z.number()
  .int('Rating must be an integer')
  .min(1, 'Rating must be at least 1')
  .max(5, 'Rating must be at most 5');

// Validation schemas
export const userRegistrationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: roleSchema.optional().default('user')
});

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema
});

export const storeSchema = z.object({
  name: z.string().min(1, 'Store name is required'),
  email: emailSchema,
  address: addressSchema,
  owner_id: z.number().int().positive().optional()
});

export const ratingSubmissionSchema = z.object({
  storeId: z.number().int().positive('Store ID must be a positive integer'),
  rating: ratingSchema
});

export const userQuerySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  role: roleSchema.optional(),
  sortBy: z.enum(['name', 'email', 'address', 'role', 'created_at']).optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional()
});

export const storeQuerySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  sortBy: z.enum(['name', 'email', 'address', 'rating', 'created_at']).optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional()
});

export const userStoreQuerySchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  sortBy: z.enum(['name', 'address', 'rating', 'created_at']).optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional()
});

// Export schemas for validation

