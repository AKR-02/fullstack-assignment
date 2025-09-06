#!/bin/bash

echo "🚀 Store Rating System - Quick Start Setup"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << 'EOL'
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_system
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
EOL
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Setup database
echo "Setting up database..."
npm run setup-db

echo "✅ Backend setup completed"

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

echo "✅ Frontend setup completed"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To start the application:"
echo "1. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Start the frontend server (in a new terminal):"
echo "   cd frontend && npm start"
echo ""
echo "3. Open your browser and go to: http://localhost:3000"
echo ""
echo "Default admin credentials:"
echo "Email: admin@example.com"
echo "Password: Admin123!"
echo ""
echo "Make sure PostgreSQL is running and the database 'store_rating_system' exists."
