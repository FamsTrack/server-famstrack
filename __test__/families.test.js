const request = require('supertest')
const app = require('../app')

const { sequelize } = require('../models')
const { queryInterface } = sequelize

let access_token

beforeAll((done) => {
  // login dulu
})

afterAll((done) => {
  queryInterface.bulkDelete('Families')
    .then(() => done())
    .catch(err => done(err))
})

// ADD

describe('Add family success', () => {
  test('')
})