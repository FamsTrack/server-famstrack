const { response } = require('express');
const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const clearDevice = require('./helpers/clear-device')

let tokenAdmin, tokenFamily, groupId;

beforeAll((done) => {
  const admin = {
    email: 'admin@famtrack.com',
    password: 'qwerty'
  }

  const family = {
    email: 'pevitapearce@famtrack.com',
    password: 'qwerty'
  }

  const admins = await request(app)
    .post('/login')
    .send(admin)

  tokenAdmin = admins.body.access_token;

  const familys = await request(app)
    .post('/login')
    .send(family)

  tokenFamily = familys.body.access_token;

  done();
})

afterAll(async(done) => {
  try {
    await clearDevice();
    await sequelize.close();
    done();
  } catch (error) {
    done(error);
  }
})

// CREATE
describe('POST /groups success', () => {
  const newGroup = {
    name: 'FamTravel',
    year: 2021
  }
  test('Register new group should send response 201 status code', (done) => {
    request(app)
      .post('/groups')
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send(newGroup)
      .then(response => {
        const { body, statusCode } = response

        groupId = body.id
        expect(statusCode).toEqual(201)
        expect(typeof body).toEqual('object')
        expect(body).toHaveProperty('id', expect.any(Number))
        expect(body).toHaveProperty('name', newGroup.name)
        expect(body).toHaveProperty('year', newGroup.year)
        done()
      })
      .catch(err => done(err))
  })
})

describe('POST /groups fail', () => {
  test('Register fail name and year empty should send response 400 status code', (done) => {
    request(app)
      .post('/groups')
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send({ name: '',  year: ''})
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(400);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(Array.isArray(body.errors)).toEqual(true);
        expect(body.errors).toEqual(
          expect.arrayContaining(['field name is required']),
          expect.arrayContaining(['field year is required'])
        );
        done()
      })
      .catch(err => done(err))
  })

  test('Register fail name empty should send response 400 status code', (done) => {
    request(app)
      .post('/groups')
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send({ name: '',  year: 2021})
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(400);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(Array.isArray(body.errors)).toEqual(true);
        expect(body.errors).toEqual(
          expect.arrayContaining(['field name is required'])
        );
        done()
      })
      .catch(err => done(err))
  })

  test('Register fail year empty should send response 400 status code', (done) => {
    request(app)
      .post('/groups')
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send({ name: 'FamTravel',  year: ''})
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(400);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(Array.isArray(body.errors)).toEqual(true);
        expect(body.errors).toEqual(
          expect.arrayContaining(['field year is required'])
        );
        done()
      })
      .catch(err => done(err))
  })

  test('Register fail no token 401 status code', (done) => {
    request(app)
      .post('/groups')
      .set('Accept', 'application/json')
      .send({ name: 'FamTravel',  year: 2021})
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(401);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors', 'unauthorize action!');
        done()
      })
      .catch(err => done(err))
  })

  test('Register fail send token but not admin 401 status code', (done) => {
    request(app)
      .post('/groups')
      .set('Accept', 'application/json')
      .set('acccess_token', tokenFamily)
      .send({ name: 'FamTravel',  year: 2021})
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(401);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors', 'unauthorize action!');
        done()
      })
      .catch(err => done(err))
  })
})

//READ

describe('GET /groups success', () => {
  test('GET groups data should send response 200 status code', (done) => {
    request(app)
      .get('/groups')
      .set('access_token', tokenAdmin)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(200)
        expect(Array.isArray(body)).toEqual(true);
        expect(body).toEqual(
          expect.arrayContaining({
            name: 'FamTravel',
            year: 2021
          })
        )
        done()
      })
      .catch(err => done(err))
  })
})

describe('GET /groups fail', () => {
  test('GET groups fail no token send response 401 status code', (done) => {
    request(app)
      .get('/groups')
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(401);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors', 'unauthorize action!');
        done()
      })
      .catch(err => done(err))
  })

  test('GET groups fail send token but not admin send response 401 status code', (done) => {
    request(app)
      .get('groups')
      .set('acccess_token', tokenFamily)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(401);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors', 'unauthorize action!');
        done()
      })
      .catch(err => done(err))
  })
})

//UPDATE

describe('PUT /groups success', () => {
  const updatedGroup = {
    name: 'FamTravelling',
    year: 2020
  }

  test('PUT groups send response 200 status code', (done) => {
    request(app)
      .put(`/groups/${groupId}`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(200)
        expect(ty)
        done()
      })
      .send(err => done(err))
  })
})