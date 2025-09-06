import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Store, Star, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin, isStoreOwner, isUser } = useAuth();

  const getWelcomeMessage = () => {
    if (isAdmin) {
      return "Welcome to the Admin Dashboard";
    } else if (isStoreOwner) {
      return "Welcome to your Store Owner Dashboard";
    } else {
      return "Welcome to the Store Rating System";
    }
  };

  const getDashboardContent = () => {
    if (isAdmin) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">User Management</h3>
                <p className="text-gray-600">Manage users and their roles</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <Store className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Store Management</h3>
                <p className="text-gray-600">Add and manage stores</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Analytics</h3>
                <p className="text-gray-600">View system statistics</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (isStoreOwner) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Store Ratings</h3>
                <p className="text-gray-600">View ratings for your store</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Store Statistics</h3>
                <p className="text-gray-600">View your store's performance</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center">
              <Store className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Browse Stores</h3>
                <p className="text-gray-600">View and rate stores</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">My Ratings</h3>
                <p className="text-gray-600">View your submitted ratings</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
        <p className="mt-2 text-gray-600">
          Hello {user?.name}, here's what you can do today.
        </p>
      </div>

      {getDashboardContent()}

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isAdmin && (
            <>
              <a href="/admin" className="btn btn-primary">
                Admin Panel
              </a>
              <a href="/stores" className="btn btn-secondary">
                Manage Stores
              </a>
            </>
          )}
          
          {isStoreOwner && (
            <>
              <a href="/store-owner" className="btn btn-primary">
                Store Dashboard
              </a>
            </>
          )}
          
          {isUser && (
            <>
              <a href="/stores" className="btn btn-primary">
                Browse Stores
              </a>
              <a href="/profile" className="btn btn-secondary">
                Update Profile
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
