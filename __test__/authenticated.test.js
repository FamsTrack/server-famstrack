const request = require('supertest')
const app = require('../app')

// REGISTER

describe('POST /register success', () => {
  const newUser = {
    email: 'user123@mail.com',
    password: '123123',
    role: 'family'
  }
  test('Register Success', (done) => {
    request(app)
    .post('/register')
    .set('Accept', 'application/json')
    .send(newUser)
    .then(response => {
      const {body, status} = response

      expect(status).toBe(201)
      expect(body).toHaveProperty('id', expect.any(Number))
      expect(body).toHaveProperty('email', 'user123@mail.com')
      done()
    })
    .catch(err => done(err))
  })
})

describe('POST /register fail', () => {
  test('Register fail email empty', (done) => {
    request(app)
    .post('/register')
    .set('Accept', 'application/json')
    .send({email: '', password: '123123'})
    .then(response => {
      const {body, status} = response

      expect(status).toBe(400)
      expect(body).toHaveProperty('message', 'email cant be empty')
      done()
    })
    .catch(err => done(err))
  })

  test('Register fail password empty', (done) => {
    request(app)
    .post('/register')
    .set('Accept', 'application/json')
    .send({email: 'user123@mail.com', password: ''})
    .then(response => {
      const {body, status} = response

      expect(status).toBe(400)
      expect(body).toHaveProperty('message', 'password atleast 6 character')
      done()
    })
    .catch(err => done(err))
  })

})

// LOGIN

describe('POST /login succes', () => {
  const validObj = {
    email: 'user123@mail.com',
    password: '123123'
  }
  test('Login succes', (done) => {
    request(app)
    .post('/login')
    .set('Accept', 'application/json')
    .send(validObj)
    .then(response => {
      const {body, status} = response

      expect(status).toBe(200)
      expect(body).toHaveProperty('access_token', expect.any(String))
      done()
    })
    .catch(err => done(err))
  })
})

describe('POST /login Fail', () => {
  test('Login fail no email in database', (done) => {
    request(app)
    .post('/login')
    .set('Accept', 'application/json')
    .send({email: 'lalala@mail.com', password: '123123'})
    .then(response => {
      const {body, status} = response

      expect(status).toBe(401)
      expect(body).toHaveProperty('message', 'invalid email/password')
      done()
    })
    .catch(err => done(err))
  })
  test('Login fail wrong password', (done) => {
    request(app)
    .post('/login')
    .set('Accept', 'application/json')
    .send({email: 'padang@mail.com', password: '1231234'})
    .then(response => {
      const {body, status} = response

      expect(status).toBe(401)
      expect(body).toHaveProperty('message', 'invalid email/password')
      done()
    })
    .catch(err => done(err))
  })
  test('Login fail not input email and password', (done) => {
    request(app)
    .post('/login')
    .set('Accept', 'application/json')
    .send({email: '', password: ''})
    .then(response => {
      const {body, status} = response

      expect(status).toBe(401)
      expect(body).toHaveProperty('message', 'invalid email/password')
      done()
    })
    .catch(err => done(err))
  })
})
