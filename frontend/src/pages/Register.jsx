import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { validateEmail, validatePassword, validateName, validateAddress } from '../utils/helpers';

const Register = () => {
  const { register: registerUser, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm();

  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Validate all fields
    const nameValidation = validateName(data.name);
    const emailValidation = validateEmail(data.email);
    const passwordValidation = validatePassword(data.password);
    const addressValidation = validateAddress(data.address);

    if (!nameValidation.isValid) {
      Object.entries(nameValidation.errors).forEach(([key, error]) => {
        if (error) setError('name', { message: error });
      });
      setIsSubmitting(false);
      return;
    }

    if (!emailValidation) {
      setError('email', { message: 'Please enter a valid email address' });
      setIsSubmitting(false);
      return;
    }

    if (!passwordValidation.isValid) {
      Object.entries(passwordValidation.errors).forEach(([key, error]) => {
        if (error) setError('password', { message: error });
      });
      setIsSubmitting(false);
      return;
    }

    if (!addressValidation.isValid) {
      Object.entries(addressValidation.errors).forEach(([key, error]) => {
        if (error) setError('address', { message: error });
      });
      setIsSubmitting(false);
      return;
    }

    const result = await registerUser(data);
    
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
    
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="form-label">
                Full Name (5-60 characters)
              </label>
              <input
                {...register('name', { 
                  required: 'Name is required',
                  minLength: { value: 5, message: 'Name must be at least 5 characters' },
                  maxLength: { value: 60, message: 'Name must be at most 60 characters' }
                })}
                type="text"
                className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="form-error">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address'
                  }
                })}
                type="email"
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">
                Password (8-16 characters, uppercase + special char)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    maxLength: { value: 16, message: 'Password must be at most 16 characters' },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/,
                      message: 'Password must contain at least one uppercase letter and one special character'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input flex-1 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-gray-600 hover:text-gray-900 px-2 py-1 border rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="address" className="form-label">
                Address (max 400 characters)
              </label>
              <textarea
                {...register('address', { 
                  required: 'Address is required',
                  maxLength: { value: 400, message: 'Address must be at most 400 characters' }
                })}
                rows={3}
                className={`form-input ${errors.address ? 'border-red-500' : ''}`}
                placeholder="Enter your address"
              />
              {errors.address && (
                <p className="form-error">{errors.address.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <LoadingSpinner size="small" text="" />
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
