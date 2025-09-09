import { User, Store, Rating } from '../models/index.js';
import { Op } from 'sequelize';

class AdminController {
  static async getDashboard(req, res) {
    try {
      const [userCount, storeCount, ratingCount] = await Promise.all([
        User.count(),
        Store.count(),
        Rating.count()
      ]);

      res.json({
        totalUsers: userCount,
        totalStores: storeCount,
        totalRatings: ratingCount
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createUser(req, res) {
    try {
      const { name, email, password, address, role = 'user' } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const user = await User.create({ name, email, password, address, role });

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          address: user.address,
          role: user.role,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Create user error:', error);
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

  static async getAllUsers(req, res) {
    try {
      const { name, email, address, role, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      
      const whereClause = {};
      if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
      if (email) whereClause.email = { [Op.iLike]: `%${email}%` };
      if (address) whereClause.address = { [Op.iLike]: `%${address}%` };
      if (role) whereClause.role = role;

      const users = await User.findAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt']
      });

      res.json({ users });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt']
      });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If user is a store owner, get their store rating
      let storeRating = null;
      if (user.role === 'store_owner') {
        const store = await Store.findOne({ where: { email: user.email } });
        if (store) {
          const ratingData = await Rating.findOne({
            where: { store_id: store.id },
            attributes: [
              [sequelize.fn('AVG', sequelize.col('rating')), 'average_rating']
            ],
            raw: true
          });
          storeRating = parseFloat(ratingData.average_rating) || 0;
        }
      }

      res.json({
        user: {
          ...user.toJSON(),
          store_rating: storeRating
        }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createStore(req, res) {
    try {
      const { name, email, address, owner_id } = req.body;

      // Check if store already exists
      const existingStore = await Store.findOne({ where: { email } });
      if (existingStore) {
        return res.status(400).json({ message: 'Store with this email already exists' });
      }

      const store = await Store.create({ name, email, address, owner_id });

      res.status(201).json({
        message: 'Store created successfully',
        store
      });
    } catch (error) {
      console.error('Create store error:', error);
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

  static async getAllStores(req, res) {
    try {
      const { name, email, address, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      
      const whereClause = {};
      if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
      if (email) whereClause.email = { [Op.iLike]: `%${email}%` };
      if (address) whereClause.address = { [Op.iLike]: `%${address}%` };

      const stores = await Store.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['name', 'email']
          },
          {
            model: Rating,
            as: 'ratings',
            attributes: ['rating']
          }
        ],
        order: [[sortBy, sortOrder]]
      });

      // Calculate average rating for each store
      const storesWithRating = stores.map(store => {
        const ratings = store.ratings.map(r => r.rating);
        const averageRating = ratings.length > 0 
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
          : 0;

        return {
          ...store.toJSON(),
          average_rating: averageRating,
          total_ratings: ratings.length,
          owner_name: store.owner?.name,
          owner_email: store.owner?.email
        };
      });

      res.json({ stores: storesWithRating });
    } catch (error) {
      console.error('Get stores error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getStoreById(req, res) {
    try {
      const { id } = req.params;
      const store = await Store.findByPk(id, {
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['name', 'email']
          }
        ]
      });
      
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }

      res.json({ store });
    } catch (error) {
      console.error('Get store error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default AdminController;