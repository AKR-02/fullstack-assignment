const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    await queryInterface.bulkInsert('users', [
      {
        name: 'System Administrator',
        email: 'admin@example.com',
        password: hashedPassword,
        address: '123 Admin Street, Admin City, AC 12345',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: 'admin@example.com'
    });
  }
};
