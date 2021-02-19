const request = require('supertest');
const { response } = require('../app');
const app = require('../app')
const { sequelize } = require('../models')
const clearGroup = require('./helpers/clear-groups')

let tokenAdmin, tokenFamily, groupId;

beforeAll(async (done) => {
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

  console.log(tokenAdmin)
  done();
})

afterAll(async(done) => {
  try {
    await clearGroup()
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

  test('Register fail no token 500 status code', (done) => {
    request(app)
      .post('/groups')
      .set('Accept', 'application/json')
      .send({ name: 'FamTravel',  year: 2021})
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(500);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors', 'jwt must be provided');
        done()
      })
      .catch(err => done(err))
  })

  test('Register fail send token but not admin 401 status code', (done) => {
    request(app)
      .post('/groups')
      .set('Accept', 'application/json')
      .set('access_token', tokenFamily)
      .send({ name: 'FamTravel', year: 2021})
      .then(response => {
        const { body, statusCode } = response
        
        expect(statusCode).toEqual(401);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors', 'unauthorize action!');
        done()
      })
      .catch(err => {
        console.log(tokenFamily);
        done(err)
      })
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
        console.log('<<<<<<<<<<<<HEYYYY>>>>>>>', body);
        expect(statusCode).toEqual(200)
        expect(Array.isArray(body)).toEqual(true);
        expect(body).toEqual(
          expect.arrayContaining([{
            
            name: 'FamTravel',
            year: 2021
          }])
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
        expect(typeof body).toEqual('object')
        expect(body).toHaveProperty('id', expect.any(Number))
        expect(body).toHaveProperty('name', body.name)
        expect(body).toHaveProperty('year', body.year)
        done()
      })
      .catch(err => done(err))
  })
})

describe('PUT /groups fail', () => {
  test('PUT fail name and year empty should send response 400 status code', (done) => {
    request(app)
      .put(`/groups/${groupId}`)
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

  test('PUT fail name empty should send response 400 status code', (done) => {
    request(app)
      .put(`/groups/${groupId}`)
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

  test('PUT fail year empty should send response 400 status code', (done) => {
    request(app)
      .put(`/groups/${groupId}`)
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

  test('PUT fail no token 500 status code', (done) => {
    request(app)
      .put(`/groups/${groupId}`)
      .set('Accept', 'application/json')
      .send({ name: 'FamTravel',  year: 2021})
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(500);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(typeof body.errors).toEqual('string');
        expect(body.errors).toEqual('jwt must be provided');
      })
      .catch(err => done(err))
  })

  test('PUT fail send token but not admin 401 status code', (done) => {
    request(app)
      .put(`/groups/${groupId}`)
      .set('Accept', 'application/json')
      .set('access_token', tokenFamily)
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

  test('group id not in database should send response 404 status code', (done) => {
    request(app)
      .put('/groups/999999999')
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

//DELETE

describe('DELETE /groups success', () => {
  test('delete success should send response 200 status code', (done) => {
    request(app)
      .delete(`/groups/${groupId}`)
      .set('access_token', tokenAdmin)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(200);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('message');
        expect(typeof body.message).toEqual('string');
        expect(body.message).toEqual('successfully delete group');
        done()
      })
      .catch(err => done(err))
  })
})

describe('DELETE /groups fail', () => {
  test('no token with 500 status code', (done) => {
    request(app)
      .delete(`/groups/${groupId}`)
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

  test('loggedin user role not admin should send response 401 status code', (done) => {
    request(app)
      .delete(`/groups/${groupId}`)
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

  test('group id not in database should send response 404 status code', (done) => {
    request(app)
      .delete('/groups/999999999')
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