import { Store, Rating, User } from '../models/index.js';
import { sequelize } from '../config/database.js';

class StoreOwnerController {
  static async getStoreRatings(req, res) {
    try {
      const userId = req.user.id;
      
      // Find store owned by this user
      const store = await Store.findOne({ where: { email: req.user.email } });
      if (!store) {
        return res.status(404).json({ message: 'Store not found for this user' });
      }

      const ratings = await Rating.findAll({
        where: { store_id: store.id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['name', 'email']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      // Calculate average rating
      const averageRatingData = await Rating.findOne({
        where: { store_id: store.id },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'average_rating'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'total_ratings']
        ],
        raw: true
      });

      const averageRating = parseFloat(averageRatingData.average_rating) || 0;
      const totalRatings = parseInt(averageRatingData.total_ratings) || 0;

      res.json({
        store: {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address
        },
        ratings,
        average_rating: averageRating,
        total_ratings: totalRatings
      });
    } catch (error) {
      console.error('Get store ratings error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getStoreStats(req, res) {
    try {
      const userId = req.user.id;
      
      // Find store owned by this user
      const store = await Store.findOne({ where: { email: req.user.email } });
      if (!store) {
        return res.status(404).json({ message: 'Store not found for this user' });
      }

      // Calculate average rating
      const averageRatingData = await Rating.findOne({
        where: { store_id: store.id },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'average_rating'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'total_ratings']
        ],
        raw: true
      });

      const averageRating = parseFloat(averageRatingData.average_rating) || 0;
      const totalRatings = parseInt(averageRatingData.total_ratings) || 0;

      res.json({
        store: {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address
        },
        average_rating: averageRating,
        total_ratings: totalRatings
      });
    } catch (error) {
      console.error('Get store stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default StoreOwnerController;