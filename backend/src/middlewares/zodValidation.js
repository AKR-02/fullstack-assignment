import { z } from 'zod';

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request body
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return res.status(400).json({
          message: 'Validation failed',
          errors: formattedErrors
        });
      }
      
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      // Validate query parameters
      const validatedData = schema.parse(req.query);
      req.query = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return res.status(400).json({
          message: 'Query validation failed',
          errors: formattedErrors
        });
      }
      
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  };
};

const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      // Validate route parameters
      const validatedData = schema.parse(req.params);
      req.params = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return res.status(400).json({
          message: 'Parameter validation failed',
          errors: formattedErrors
        });
      }
      
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  };
};

export {
  validateRequest,
  validateQuery,
  validateParams
};
