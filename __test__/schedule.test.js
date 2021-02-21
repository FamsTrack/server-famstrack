const request = require('supertest');
const app = require('../app')
const { sequelize } = require('../models')
const clearSchedule = require('./helpers/clear-schedule')

const groupId = 1
const input = {
  name: 'Shalat',
  description: 'Shalat magrib',
  date: '2021-03-20',
  time: '18:30'
}

let tokenAdmin, tokenFamily, scheduleId;

beforeAll(async(done) => {
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
    await clearSchedule()
    await sequelize.close();
    done();
  } catch (error) {
    done(error);
  }
})

// CREATE

describe('POST /groups/:id/schedule success', () => {
  test('create new schedule should send response 201 status code', (done) => {
    request(app)
      .post(`/groups/${groupId}/schedule`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send(input)
      .then(response => {
        const { body, statusCode } = response

        scheduleId = body.id
        expect(statusCode).toEqual(201)
        expect(typeof body).toEqual('object')
        expect(body).toHaveProperty('id', expect.any(Number))
        expect(body).toHaveProperty('name', input.name)
        expect(body).toHaveProperty('date', input.date)
        expect(body).toHaveProperty('time', input.time)
        expect(body).toHaveProperty('description', input.description)
        expect(body).toHaveProperty('groupId', groupId)
        done()
      })
      .catch(err => done(err))
  })
})

describe('POST /groups/:id/schedule fail', () => {
  test('create fail name, date, description and groupId are empty should send response 400 status code', (done) => {
    request(app)
      .post(`/groups/${groupId}/schedule`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send({ name: '', date: '', time: '', description: '' })
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(400);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(Array.isArray(body.errors)).toEqual(true);
        expect(body.errors).toEqual(
          expect.arrayContaining(['field name is required']),
          expect.arrayContaining(['field date is required']),
          expect.arrayContaining(['field time is required']),
          expect.arrayContaining(['field description is required'])
        );
        done()
      })
      .catch(err => done(err))
  })

  test('create fail name empty should send response 400 status code', (done) => {
    request(app)
      .post(`/groups/${groupId}/schedule`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send({ name: '', date: input.date, time: input.time, description: input.description })
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

  test('create fail date empty should send response 400 status code', (done) => {
    request(app)
      .post(`/groups/${groupId}/schedule`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send({ name: input.name, date: '', time: input.time, description: input.description })
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(400);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(Array.isArray(body.errors)).toEqual(true);
        expect(body.errors).toEqual(
          expect.arrayContaining(['field date is required'])
        );
        done()
      })
      .catch(err => done(err))
  })

  test('create fail description empty should send response 400 status code', (done) => {
    request(app)
      .post(`/groups/${groupId}/schedule`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send({ name: input.name, date: input.date, time: input.time, description: '' })
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(400);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(Array.isArray(body.errors)).toEqual(true);
        expect(body.errors).toEqual(
          expect.arrayContaining(['field description is required'])
        );
        done()
      })
      .catch(err => done(err))
  })

  test('create fail groupId not in data base should send response 400 status code', (done) => {
    request(app)
      .post(`/groups/9999/schedule`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send({ name: input.name, date: input.date, description: input.description })
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(404)
        expect(typeof body).toEqual('object')
        expect(body).toHaveProperty('errors')
        expect(typeof body.errors).toEqual('string')
        expect(body.errors).toEqual('not found!')
        done()
      })
      .catch(err => done(err))
  })

  test('Register fail no token should send response 500 status code', (done) => {
    request(app)
      .post(`/groups/${groupId}/schedule`)
      .set('Accept', 'application/json')
      .send(input)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(500);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors', 'jwt must be provided');
        done()
      })
      .catch(err => done(err))
  })

  test('Register fail send token but not admin should send response 401 status code', (done) => {
    request(app)
      .post(`/groups/${groupId}/schedule`)
      .set('Accept', 'application/json')
      .set('access_token', tokenFamily)
      .send(input)
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

// READ

describe('GET /groups/:id/schedule success', () => {
  test('GET schedule data should send response 200 status code', (done) => {
    request(app)
      .get(`/groups/${groupId}/schedule`)
      .set('access_token', tokenAdmin)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(200)
        expect(Array.isArray(body)).toEqual(true);
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: input.name,
              description: input.description,
              date: input.date,
              time: input.time,
              groupId: groupId,
              createdAt: expect.any(String),
              updatedAt: expect.any(String)
            })
          ])
        )
        done()
      })
      .catch(err => done(err))
  })
})

describe('GET /groups/:id/schedule fail', () => {
  test('create fail groupId not in data base should send response 400 status code', (done) => {
    request(app)
      .post(`/groups/9999/schedule`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send({ name: input.name, date: input.date, description: input.description })
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(404)
        expect(typeof body).toEqual('object')
        expect(body).toHaveProperty('errors')
        expect(typeof body.errors).toEqual('string')
        expect(body.errors).toEqual('not found!')
        done()
      })
      .catch(err => done(err))
  })
})

// UPDATE

describe('PUT /groups/:id/schedule/:schId success', () => {
  const updated = {
    name: 'Shalat',
    description: 'Shalat isya',
    date: '2021-03-20',
    time: '18:30'
  }

  test('PUT groups send response 200 status code', (done) => {
    request(app)
      .put(`/groups/${groupId}/schedule/${scheduleId}`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send(updated)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(200)
        expect(typeof body).toEqual('object')
        expect(body).toHaveProperty('id', expect.any(Number))
        expect(body).toHaveProperty('name', updated.name)
        expect(body).toHaveProperty('date', updated.date)
        expect(body).toHaveProperty('time', updated.time)
        expect(body).toHaveProperty('description', updated.description)
        expect(body).toHaveProperty('groupId', groupId)
        done()
      })
      .catch(err => done(err))
  })
})

describe('PUT /groups/:id/schedule/:schId fail', () => {
  test('PUT fail name, description, date and time empty should send response 400 status code', (done) => {
    const failObj = {
      name: '',
      description: '',
      date: '',
      time: ''
    }
    request(app)
      .put(`/groups/${groupId}/schedule/${scheduleId}`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send(failObj)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(400);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(Array.isArray(body.errors)).toEqual(true);
        expect(body.errors).toEqual(
          expect.arrayContaining(['field name is required']),
          expect.arrayContaining(['field description is required']),
          expect.arrayContaining(['field date is required']),
          expect.arrayContaining(['field time is required']),
        );
        done()
      })
      .catch(err => done(err))
  })

  test('PUT fail name empty should send response 400 status code', (done) => {
    const failObj = {
      name: '',
      description: input.description,
      date: input.date,
      time: input.time
    }
    request(app)
      .put(`/groups/${groupId}/schedule/${scheduleId}`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send(failObj)
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

  test('PUT fail description empty should send response 400 status code', (done) => {
    const failObj = {
      name: input.name,
      description: '',
      date: input.date,
      time: input.time
    }

    request(app)
      .put(`/groups/${groupId}/schedule/${scheduleId}`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send(failObj)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(400);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(Array.isArray(body.errors)).toEqual(true);
        expect(body.errors).toEqual(
          expect.arrayContaining(['field description is required'])
        );
        done()
      })
      .catch(err => done(err))
  })

  test('PUT fail date empty should send response 400 status code', (done) => {
    const failObj = {
      name: input.name,
      description: input.description,
      date: '',
      time: input.time
    }

    request(app)
      .put(`/groups/${groupId}/schedule/${scheduleId}`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send(failObj)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(400);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(Array.isArray(body.errors)).toEqual(true);
        expect(body.errors).toEqual(
          expect.arrayContaining(['field date is required'])
        );
        done()
      })
      .catch(err => done(err))
  })

  test('PUT fail time empty should send response 400 status code', (done) => {
    const failObj = {
      name: input.name,
      description: input.description,
      date: input.date,
      time: ''
    }

    request(app)
      .put(`/groups/${groupId}/schedule/${scheduleId}`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send(failObj)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(400);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(Array.isArray(body.errors)).toEqual(true);
        expect(body.errors).toEqual(
          expect.arrayContaining(['field time is required'])
        );
        done()
      })
      .catch(err => done(err))
  })

  test('PUT fail no token 500 status code', (done) => {
    request(app)
      .put(`/groups/${groupId}/schedule/${scheduleId}`)
      .set('Accept', 'application/json')
      .send({ name: 'FamTravel', year: 2021 })
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(500);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(typeof body.errors).toEqual('string');
        expect(body.errors).toEqual('jwt must be provided');
        done()
      })
      .catch(err => done(err))
  })

  test('PUT fail send token but not admin 401 status code', (done) => {
    request(app)
      .put(`/groups/${groupId}/schedule/${scheduleId}`)
      .set('Accept', 'application/json')
      .set('access_token', tokenFamily)
      .send({ name: 'FamTravel', year: 2021 })
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(401);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors', 'unauthorize action!');
        done()
      })
      .catch(err => done(err))
  })

  test('PUT fail groupId not in database should send response 404 status code', (done) => {
    request(app)
      .put(`/groups/99999/schedule/${scheduleId}`)
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

  test('PUT fail scheduleId not in database should send response 404 status code', (done) => {
    request(app)
      .put(`/groups/${groupId}/schedule/99999`)
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

  test('PUT fail scheduleId and groupId not in database should send response 404 status code', (done) => {
    request(app)
      .put(`/groups/9999/schedule/9999`)
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

// DELETE

describe('DELETE /groups/:id/schedule/:schId success', () => {
  test('delete success should send response 200 status code', (done) => {
    request(app)
      .delete(`/groups/${groupId}/schedule/${scheduleId}`)
      .set('access_token', tokenAdmin)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(200);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('message');
        expect(typeof body.message).toEqual('string');
        expect(body.message).toEqual('successfully delete schedule');
        done()
      })
      .catch(err => done(err))
  })
})

describe('DELETE /groups/:id/schedule/:schId fail', () => {
  test('delete fail no token should send response with 500 status code', (done) => {
    request(app)
      .delete(`/groups/${groupId}/schedule/${scheduleId}`)
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
      .delete(`/groups/${groupId}/schedule/${scheduleId}`)
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

  test('delete fail groupId id not in database should send response 404 status code', (done) => {
    request(app)
      .delete(`/groups/9999/schedule/${scheduleId}`)
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
  test('delete fail scheduleId id not in database should send response 404 status code', (done) => {
    request(app)
      .delete(`/groups/${groupId}/schedule/9999`)
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
  test('delete fail groupId and scheduleId id not in database should send response 404 status code', (done) => {
    request(app)
      .delete(`/groups/9999/schedule/9999`)
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