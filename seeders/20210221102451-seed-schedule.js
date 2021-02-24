'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Schedules', [
      {
        name: 'Shalat',
        description: 'Shalat zuhur',
        date: '2021-12-21',
        time: '12:00',
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Schedules', null)
  }
};
