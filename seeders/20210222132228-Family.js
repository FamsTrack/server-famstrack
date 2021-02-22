'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Families', [{
        name: 'Pevita Pearce',
        address: 'jln. bangau',
        gender: 'wanita',
        contact: '082713611',
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'David Beckamp',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '08321712',
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  down: async(queryInterface, Sequelize) => {

  }
};