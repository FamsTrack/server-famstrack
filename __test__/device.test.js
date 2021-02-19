const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize

let access_token

beforeAll((done) => {
  // login dulu
})

afterAll((done) => {
  queryInterface.bulkDelete('Devices')
  .then(() => done())
  .catch(err => done(err))
})

// REGISTER

describe('POST /device success', () => {
  const newDevice = {
    arduino_unique_key: 'qwert12345'
  }
  test('Register Success', (done) => {
    request(app)
    .post('/register')
    .set('Accept', 'application/json')
    .set('access_token', access_token)
    .send(newDevice)
    .then(response => {
      const {body, status} = response

      expect(status).toBe(201)
      expect(body).toHaveProperty('id', expect.any(Number))
      expect(body).toHaveProperty('arduino_unique_key', 'qwert12345')
      done()
    })
    .catch(err => done(err))
  })
})

describe('POST /device fail', () => {
  test('no access_token', (done) => {
    request(app)
    .post('/register')
    .set('Accept', 'application/json')
    .send({arduino_unique_key: 'qwert12345'})
    .then(response => {
      const {body, status} = response

      expect(status).toBe(400)
      expect(body).toHaveProperty('message', 'arduino_unique_key cant be empty')
      done()
    })
    .catch(err => done(err))
  })

  test('arduino_unique_key empty', (done) => {
    request(app)
    .post('/register')
    .set('Accept', 'application/json')
    .set('access_token', access_token)
    .send({arduino_unique_key: ''})
    .then(response => {
      const {body, status} = response

      expect(status).toBe(400)
      expect(body).toHaveProperty('message', 'arduino_unique_key cant be empty')
      done()
    })
    .catch(err => done(err))
  })
})

// PATCH

// DELETE