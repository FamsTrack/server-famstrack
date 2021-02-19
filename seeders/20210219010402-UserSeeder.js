'use strict';
const { hashPassword } = require('../helpers/hash');

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      { email: 'admin@famtrack.com', password: hashPassword('qwerty'), role: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { email: 'pevitapearce@famtrack.com', password: hashPassword('qwerty'), role: 'family', createdAt: new Date(), updatedAt: new Date() }
    ])
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', [
      { email: 'admin@famtrack.com', role: 'admin' },
      { email: 'pevitapearce@famtrack.com', role: 'family' }
    ]);
  }
};