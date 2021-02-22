'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Clients', [{
        name: 'Papa pevita',
        img: 'http://m.ayosemarang.com/images-semarang/post/articles/2020/02/07/51837/deddy-corbuzier-.jpg',
        address: 'jln. jalan',
        gender: 'pria',
        contact: '0823616231',
        familiesId: 1,
        groupId: 1,
        birth_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kakek David Beckamp',
        img: 'https://publika.co.id/wp-content/uploads/2020/05/images-32-657x430.jpeg',
        address: 'jln. jalan',
        gender: 'pria',
        contact: '0823616231',
        familiesId: 2,
        groupId: 1,
        birth_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async(queryInterface, Sequelize) => {

  }
};