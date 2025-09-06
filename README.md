# Store Rating System

A fullstack web application that allows users to submit ratings for registered stores with role-based access control.

## Features

### User Roles
- **System Administrator**: Can add stores, users, and admin users. Has access to dashboard with statistics and management features.
- **Normal User**: Can sign up, browse stores, and submit ratings (1-5 stars).
- **Store Owner**: Can view ratings submitted for their store and see average ratings.

### Key Functionalities

#### System Administrator
- Dashboard with total users, stores, and ratings count
- Add new users with details (Name, Email, Password, Address)
- View list of stores with details (Name, Email, Address, Rating)
- View list of users with details (Name, Email, Address, Role)
- Apply filters on all listings based on Name, Email, Address, and Role
- View detailed user information including store ratings for store owners

#### Normal User
- Sign up and login
- Update password
- View list of all registered stores
- Search stores by Name and Address
- Submit ratings (1-5 stars) for stores
- Modify previously submitted ratings
- View their submitted ratings

#### Store Owner
- Login and update password
- View list of users who submitted ratings for their store
- See average rating of their store
- View rating distribution and statistics

### Form Validations
- **Name**: 20-60 characters
- **Address**: Maximum 400 characters
- **Password**: 8-16 characters, must include uppercase letter and special character
- **Email**: Standard email validation

## Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator + Sequelize validations
- **Security**: Helmet, CORS, bcryptjs

### Frontend
- **Framework**: React.js
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **UI**: Custom CSS with modern design
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup
1. Install PostgreSQL and create a database named `store_rating_system`
2. Update the database credentials in `backend/.env` file:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=store_rating_system
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=store_rating_system
   DB_USER=postgres
   DB_PASSWORD=password
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will automatically create the database tables and seed initial data including a default admin user:
- Email: `admin@example.com`
- Password: `Admin123!`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/password` - Update password

### Admin Routes (Admin only)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `POST /api/admin/users` - Create new user
- `GET /api/admin/users` - Get all users with filters
- `GET /api/admin/users/:id` - Get user by ID
- `POST /api/admin/stores` - Create new store
- `GET /api/admin/stores` - Get all stores with filters
- `GET /api/admin/stores/:id` - Get store by ID

### User Routes (Authenticated users)
- `GET /api/user/stores` - Get stores for user with ratings
- `POST /api/user/ratings` - Submit rating
- `PUT /api/user/ratings` - Update rating
- `GET /api/user/ratings` - Get user's ratings

### Store Owner Routes (Store owners only)
- `GET /api/store-owner/ratings` - Get store ratings
- `GET /api/store-owner/stats` - Get store statistics

## Database Schema

### Users Table
- `id` (Primary Key)
- `name` (VARCHAR, 20-60 chars)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `address` (VARCHAR, Max 400 chars)
- `role` (ENUM: admin, user, store_owner)
- `created_at`, `updated_at`

### Stores Table
- `id` (Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `address` (VARCHAR, Max 400 chars)
- `owner_id` (Foreign Key to Users)
- `created_at`, `updated_at`

### Ratings Table
- `id` (Primary Key)
- `user_id` (Foreign Key to Users)
- `store_id` (Foreign Key to Stores)
- `rating` (INTEGER, 1-5)
- `created_at`, `updated_at`
- Unique constraint on (user_id, store_id)

## Features Implemented

✅ **Complete Backend Implementation**
- Express.js server with proper middleware
- PostgreSQL database with proper schema
- JWT authentication with role-based access control
- Comprehensive validation middleware
- RESTful API endpoints for all features

✅ **Complete Frontend Implementation**
- React.js with modern hooks and context
- Responsive design with mobile support
- Form validation matching backend requirements
- Role-based navigation and access control
- Interactive star rating system
- Real-time search and filtering

✅ **All Required Features**
- User registration and authentication
- Role-based dashboards (Admin, User, Store Owner)
- Store management and rating system
- Comprehensive form validation
- Search and filtering capabilities
- Password update functionality
- Statistics and analytics

✅ **Additional Features**
- Modern, responsive UI design
- Loading states and error handling
- Toast notifications
- Data sorting capabilities
- Rating distribution visualization
- Mobile-friendly interface

## Default Admin Credentials
- **Email**: admin@example.com
- **Password**: Admin123!

## Sequelize ORM Features

The application now uses Sequelize ORM for better database management:

### Models
- **User Model**: Handles user authentication, validation, and password hashing
- **Store Model**: Manages store information and relationships
- **Rating Model**: Handles user ratings with proper constraints

### Database Operations
- **Automatic Validation**: Sequelize handles field validation at the model level
- **Relationships**: Proper foreign key relationships between users, stores, and ratings
- **Hooks**: Password hashing happens automatically before save/update
- **Associations**: Easy querying with includes and joins

### Migration Commands
```bash
# Run migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Run seeders
npm run db:seed

# Undo seeders
npm run db:seed:undo
```

## Development Notes
- All form validations match the specified requirements
- Database schema follows best practices with proper relationships
- Security measures include password hashing, JWT tokens, and input validation
- The application supports sorting on all major fields
- Responsive design works on desktop, tablet, and mobile devices
- Sequelize ORM provides better database abstraction and validation
