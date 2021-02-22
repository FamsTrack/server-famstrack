'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Schedules', [{
        name: 'Shalat',
        description: 'Shalat magrib',
        date: '2021-03-23',
        time: '18:30',
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Shalat',
        description: 'Shalat Isya',
        date: '2021-03-23',
        time: '19:30',
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async(queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};