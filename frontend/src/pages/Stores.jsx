import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import { formatRating, debounce } from '../utils/helpers';
import { Search, Star } from 'lucide-react';

const Stores = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [userRatings, setUserRatings] = useState({});

  const debouncedSearch = debounce(() => {
    fetchStores();
  }, 500);

  useEffect(() => {
    fetchStores();
  }, [sortBy, sortOrder]);

  useEffect(() => {
    debouncedSearch();
  }, [searchName, searchAddress]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchName) params.append('name', searchName);
      if (searchAddress) params.append('address', searchAddress);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const response = await api.get(`/user/stores?${params}`);
      setStores(response.data.stores);
      
      // Create a map of user ratings for quick lookup
      const ratingsMap = {};
      response.data.stores.forEach(store => {
        if (store.user_rating) {
          ratingsMap[store.id] = store.user_rating;
        }
      });
      setUserRatings(ratingsMap);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (storeId, rating) => {
    try {
      await api.post('/user/ratings', {
        storeId,
        rating
      });
      
      toast.success('Rating submitted successfully!');
      
      // Update local state
      setUserRatings(prev => ({
        ...prev,
        [storeId]: rating
      }));
      
      // Refresh stores to get updated average rating
      fetchStores();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
    }
  };

  const handleRatingUpdate = async (storeId, rating) => {
    try {
      await api.put('/user/ratings', {
        storeId,
        rating
      });
      
      toast.success('Rating updated successfully!');
      
      // Update local state
      setUserRatings(prev => ({
        ...prev,
        [storeId]: rating
      }));
      
      // Refresh stores to get updated average rating
      fetchStores();
    } catch (error) {
      console.error('Error updating rating:', error);
      toast.error('Failed to update rating');
    }
  };

  if (loading && stores.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stores</h1>
        <p className="mt-2 text-gray-600">Browse and rate stores</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Search by Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="form-input pl-10"
                placeholder="Store name..."
              />
            </div>
          </div>
          
          <div>
            <label className="form-label">Search by Address</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="form-input pl-10"
                placeholder="Address..."
              />
            </div>
          </div>
          
          <div>
            <label className="form-label">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
            >
              <option value="name">Name</option>
              <option value="address">Address</option>
              <option value="rating">Rating</option>
              <option value="created_at">Created Date</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="form-input"
            >
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-32">
          <LoadingSpinner />
        </div>
      ) : stores.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray-500">No stores found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div key={store.id} className="card">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                  <p className="text-sm text-gray-600">{store.address}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">
                    {formatRating(store.average_rating)} ({store.total_ratings} ratings)
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Your Rating:</p>
                  <StarRating
                    rating={userRatings[store.id] || 0}
                    onRatingChange={(rating) => {
                      if (userRatings[store.id]) {
                        handleRatingUpdate(store.id, rating);
                      } else {
                        handleRatingSubmit(store.id, rating);
                      }
                    }}
                    interactive={true}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stores;
