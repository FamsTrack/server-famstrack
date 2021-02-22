'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Devices', [{
        longitude: 21.435957167256333,
        latitude: 39.82456281213858,
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: 'DVC1FT',
        clientId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        longitude: 21.405176,
        latitude: 39.882204,
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: 'DVC2FT',
        clientId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async(queryInterface, Sequelize) => {

  }
};