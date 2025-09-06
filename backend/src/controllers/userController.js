import { Store, Rating, User } from '../models/index.js';
import { Op } from 'sequelize';

class UserController {
  static async getStores(req, res) {
    try {
      const { name, address, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
      
      const whereClause = {};
      if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
      if (address) whereClause.address = { [Op.iLike]: `%${address}%` };

      const stores = await Store.findAll({
        where: whereClause,
        include: [
          {
            model: Rating,
            as: 'ratings',
            attributes: ['rating', 'user_id']
          }
        ],
        order: [[sortBy, sortOrder]]
      });

      // Get user's ratings for these stores
      const userRatings = await Rating.findAll({
        where: { user_id: req.user.id },
        attributes: ['store_id', 'rating']
      });

      const userRatingMap = {};
      userRatings.forEach(rating => {
        userRatingMap[rating.store_id] = rating.rating;
      });

      // Calculate average rating and add user rating for each store
      const storesWithRating = stores.map(store => {
        const ratings = store.ratings.map(r => r.rating);
        const averageRating = ratings.length > 0 
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
          : 0;

        return {
          ...store.toJSON(),
          average_rating: averageRating,
          total_ratings: ratings.length,
          user_rating: userRatingMap[store.id] || null
        };
      });

      res.json({ stores: storesWithRating });
    } catch (error) {
      console.error('Get stores error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async submitRating(req, res) {
    try {
      const { storeId, rating } = req.body;
      const userId = req.user.id;

      // Check if store exists
      const store = await Store.findByPk(storeId);
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }

      // Use upsert to create or update rating
      const [ratingData, created] = await Rating.upsert({
        user_id: userId,
        store_id: storeId,
        rating: rating
      });

      res.status(201).json({
        message: created ? 'Rating submitted successfully' : 'Rating updated successfully',
        rating: ratingData
      });
    } catch (error) {
      console.error('Submit rating error:', error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateRating(req, res) {
    try {
      const { storeId, rating } = req.body;
      const userId = req.user.id;

      // Check if store exists
      const store = await Store.findByPk(storeId);
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }

      const [ratingData, created] = await Rating.upsert({
        user_id: userId,
        store_id: storeId,
        rating: rating
      });

      res.json({
        message: created ? 'Rating submitted successfully' : 'Rating updated successfully',
        rating: ratingData
      });
    } catch (error) {
      console.error('Update rating error:', error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getUserRatings(req, res) {
    try {
      const ratings = await Rating.findAll({
        where: { user_id: req.user.id },
        include: [
          {
            model: Store,
            as: 'store',
            attributes: ['name', 'address']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      res.json({ ratings });
    } catch (error) {
      console.error('Get user ratings error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default UserController;