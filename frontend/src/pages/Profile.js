import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { validatePassword } from '../utils/helpers';
import { User, Lock } from 'lucide-react';

const Profile = () => {
  const { user, updatePassword } = useAuth();
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm();

  const handlePasswordUpdate = async (data) => {
    setIsUpdatingPassword(true);
    
    // Validate password
    const passwordValidation = validatePassword(data.newPassword);
    if (!passwordValidation.isValid) {
      Object.entries(passwordValidation.errors).forEach(([key, error]) => {
        if (error) setError('newPassword', { message: error });
      });
      setIsUpdatingPassword(false);
      return;
    }

    const result = await updatePassword(data.currentPassword, data.newPassword);
    
    if (result.success) {
      toast.success('Password updated successfully!');
      setShowPasswordForm(false);
      reset();
    } else {
      toast.error(result.message);
    }
    
    setIsUpdatingPassword(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">Manage your account information</p>
      </div>

      {/* User Information */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-gray-900">{user?.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="text-gray-900 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Change Password</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Update Form */}
      {showPasswordForm && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
          
          <form onSubmit={handleSubmit(handlePasswordUpdate)} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <input
                {...register('currentPassword', { required: 'Current password is required' })}
                type="password"
                className={`form-input ${errors.currentPassword ? 'border-red-500' : ''}`}
                placeholder="Enter current password"
              />
              {errors.currentPassword && (
                <p className="form-error">{errors.currentPassword.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="newPassword" className="form-label">
                New Password (8-16 characters, uppercase + special char)
              </label>
              <input
                {...register('newPassword', { 
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  maxLength: { value: 16, message: 'Password must be at most 16 characters' },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/,
                    message: 'Password must contain at least one uppercase letter and one special character'
                  }
                })}
                type="password"
                className={`form-input ${errors.newPassword ? 'border-red-500' : ''}`}
                placeholder="Enter new password"
              />
              {errors.newPassword && (
                <p className="form-error">{errors.newPassword.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === document.querySelector('input[name="newPassword"]').value || 'Passwords do not match'
                })}
                type="password"
                className={`form-input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="btn btn-primary"
              >
                {isUpdatingPassword ? (
                  <LoadingSpinner size="small" text="" />
                ) : (
                  'Update Password'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  reset();
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
