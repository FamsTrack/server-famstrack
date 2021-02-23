const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const clearUser = require('./helpers/clear-user');

describe('Authenticate', () => {
  afterAll(async(done) => {
    try {
      await clearUser();
      await sequelize.close();
      done();
    } catch (err) {
      done(err)
    }
  });

  // REGISTER
  describe('POST /register success', () => {
    const newUser = {
      email: 'user123@famtrack.com',
      password: '123123',
      role: 'family'
    }
    test('Register user should send response 201 status code', (done) => {
      request(app)
        .post('/register')
        .set('Accept', 'application/json')
        .send(newUser)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toBe(201)
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('id', expect.any(Number))
          expect(body).toHaveProperty('email', newUser.email);
          expect(body).toHaveProperty('role', newUser.role);
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('POST /register fail', () => {
    test('Register fail email, password, role empty should send response 400 status code', (done) => {
      request(app)
        .post('/register')
        .set('Accept', 'application/json')
        .send({ email: '', password: '', role: '' })
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field email is required']),
            expect.arrayContaining(['invalid email']),
            expect.arrayContaining(['field password is required']),
            expect.arrayContaining(['password at least have 6 character']),
            expect.arrayContaining(['role should be one of admin or customer'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('Register fail email must unique should send response 400 status code', (done) => {
      request(app)
        .post('/register')
        .set('Accept', 'application/json')
        .send({ email: 'user123@famtrack.com', password: '123123', role: 'family' })
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['email must be unique']),
          );
          done()
        })
        .catch(err => done(err))
    })

    test('Register fail email empty should send response 400 status code', (done) => {
      request(app)
        .post('/register')
        .set('Accept', 'application/json')
        .send({ email: '', password: '123123', role: 'family' })
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field email is required']),
            expect.arrayContaining(['invalid email']),
          );
          done()
        })
        .catch(err => done(err))
    })

    test('Register fail password empty should send response 400 status code', (done) => {
      request(app)
        .post('/register')
        .set('Accept', 'application/json')
        .send({ email: 'user123@famtrack.com', password: '', role: 'family' })
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field password is required']),
            expect.arrayContaining(['password at least have 6 character']),
          );
          done()
        })
        .catch(err => done(err))
    })

    test('Register fail password less than 6 charachter should send response 400 status code', (done) => {
      request(app)
        .post('/register')
        .set('Accept', 'application/json')
        .send({ email: 'user123@famtrack.com', password: '12345', role: 'family' })
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['password at least have 6 character']),
          );
          done()
        })
        .catch(err => done(err))
    })

    test('Register fail role empty should send response 400 status code', (done) => {
      request(app)
        .post('/register')
        .set('Accept', 'application/json')
        .send({ email: 'user123@famtrack.com', password: 'qwerty', role: '' })
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['role should be one of admin or family']),
          );
          done()
        })
        .catch(err => done(err))
    })

  })

  // LOGIN
  describe('POST /login succes', () => {
    const validObj = {
      email: 'pevitapearce@famtrack.com',
      password: 'qwerty'
    }
    test('Login succes should send response 200 status code', (done) => {
      request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send(validObj)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toBe(200)
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('access_token', expect.any(String))
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('POST /login Fail', () => {
    test('Login fail no email in database should send response 401', (done) => {
      request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ email: 'lalala@mail.com', password: 'qwerty' })
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toBe(401)
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(body).toHaveProperty('errors', 'invalid email/password')
          done()
        })
        .catch(err => done(err))
    })

    test('Login fail wrong password should send response 401', (done) => {
      request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ email: 'pevitapearce@famtrack.com', password: '1231234' })
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(401);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(body).toHaveProperty('errors', 'invalid email/password');
          done()
        })
        .catch(err => done(err))
    })
    test('Login fail not input email and password should send response 401', (done) => {
      request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ email: '', password: '' })
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toBe(401);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(body).toHaveProperty('errors', 'invalid email/password');
          done()
        })
        .catch(err => done(err))
    })
  })
})