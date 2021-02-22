const request = require('supertest');
const app = require('../app')
const { sequelize } = require('../models')
const clearUser = require('./helpers/clear-user');

let tokenAdmin, tokenFamily, id

beforeAll(async(done) => {
  const admin = {
    email: 'admin@famtrack.com',
    password: 'qwerty'
  }

  const family = {
    email: 'pevitapearce@famtrack.com',
    password: 'qwerty'
  }

  const user = {
    email: 'padanglalala@mail.com',
    password: 'qwerty12345',
    role: 'family'
  }

  const admins = await request(app)
    .post('/login')
    .send(admin)

  tokenAdmin = admins.body.access_token;

  const familys = await request(app)
    .post('/login')
    .send(family)

  tokenFamily = familys.body.access_token;

  const users = await request(app)
    .post('/register')
    .send(user)

  id = users.body.id
  console.log('<<<<<<< HAHAHAHHA', users);
  done();
})

afterAll(async(done) => {
  try {
    await clearUser();
    await sequelize.close();
    done();
  } catch (err) {
    done(err)
  }
});

describe('GET /user success', () => {
  test('GET groups data should send response 200 status code', (done) => {
    request(app)
      .get('/user')
      .set('access_token', tokenAdmin)
      .then(response => {
        const { body, statusCode } = response
        expect(statusCode).toEqual(200)
        expect(Array.isArray(body)).toEqual(true);
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              email: expect.any(String),
              password: expect.any(String),
              role: expect.any(String)
            })
          ])
        )
        done()
      })
      .catch(err => done(err))
  })
})

describe('GET /user fail', () => {
  test('GET user fail no token send response 500 status code', (done) => {
    request(app)
      .get('/user')
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(500);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(typeof body.errors).toEqual('string');
        expect(body.errors).toEqual('jwt must be provided');
        done();
      })
      .catch(err => done(err))
  })

  test('GET user fail send token but not admin send response 401 status code', (done) => {
    request(app)
      .get('/user')
      .set('access_token', tokenFamily)
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

describe('DELETE /user/:id success', () => {
  test('delete success should send response 200 status code', (done) => {
    request(app)
      .delete(`/user/${id}`)
      .set('access_token', tokenAdmin)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(200);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('message');
        expect(typeof body.message).toEqual('string');
        expect(body.message).toEqual('successfully delete user');
        done()
      })
      .catch(err => done(err))
  })
})

describe('DELETE /user/:id fail', () => {
  test('delete fail no token with 500 status code', (done) => {
    request(app)
      .delete(`/user/${id}`)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(500)
        expect(typeof body).toEqual('object')
        expect(body).toHaveProperty('errors')
        expect(typeof body.errors).toEqual('string')
        expect(body.errors).toEqual('jwt must be provided')

        done();
      })
      .catch(err => done(err))
  });

  test('delete fail loggedin user role not admin should send response 401 status code', (done) => {
    request(app)
      .delete(`/user/${id}`)
      .set('access_token', tokenFamily)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(401)
        expect(typeof body).toEqual('object')
        expect(body).toHaveProperty('errors', 'unauthorize action!')
        done()
      })
      .catch(err => done(err))
  })

  test('delete fail user id not in database should send response 404 status code', (done) => {
    request(app)
      .delete('/user/9999')
      .set('access_token', tokenAdmin)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(404)
        expect(typeof body).toEqual('object')
        expect(body).toHaveProperty('errors')
        expect(typeof body.errors).toEqual('string')
        expect(body.errors).toEqual('not found!')

        done();
      })
      .catch(err => done(err))
  })
})