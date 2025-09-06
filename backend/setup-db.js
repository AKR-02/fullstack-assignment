import { sequelize } from './src/config/database.js';
import { User } from './src/models/index.js';

async function setupDatabase() {
  try {
    console.log('Setting up database with Sequelize...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Sync database (create tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created');
    
    // Create default admin user
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    
    if (!adminExists) {
      await User.create({
        name: 'System Administrator',
        email: 'admin@example.com',
        password: 'Admin123!',
        address: '123 Admin Street, Admin City, AC 12345',
        role: 'admin'
      });
      
      console.log('✅ Default admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nDefault admin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: Admin123!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

setupDatabase();