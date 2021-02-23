const request = require('supertest');
const app = require('../app')
const { sequelize } = require('../models')
const clearNews = require('./helpers/clear-news')

const input = {
  name: 'Qui potest igitur habitare in beata vita summi mali metus?',
  image: '/image.pjg',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Solum praeterea formosum, solum liberum, solum civem, stultost; Est autem etiam actio quaedam corporis, quae motus et status naturae congruentis tenet; Aeque enim contingit omnibus fidibus, ut incontentae sint. Hic nihil fuit, quod quaereremus. Sed ut iis bonis erigimur, quae expectamus, sic laetamur iis, quae recordamur. Duo Reges: constructio interrete. Aut haec tibi, Torquate, sunt vituperanda aut patrocinium voluptatis repudiandum.'
}
let tokenAdmin, tokenFamily, newsId;

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
    await clearNews()
    await sequelize.close();
    done();
  } catch (error) {
    done(error);
  }
})

//CREATE
describe('POST /news success', () => {
  test('create new news should send response 201 status code', (done) => {
    request(app)
      .post('/news')
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send(input)
      .then(response => {
        const { body, statusCode } = response

        newsId = body.id
        expect(statusCode).toEqual(201)
        expect(typeof body).toEqual('object')
        expect(body).toHaveProperty('id', expect.any(Number))
        expect(body).toHaveProperty('name', input.name)
        expect(body).toHaveProperty('image', input.image)
        expect(body).toHaveProperty('description', input.description)
        expect(body).toHaveProperty('active', true)
        done()
      })
      .catch(err => done(err))
  })
})

describe('POST /news fail', () => {
  test('create fail name, image and description are empty should send response 400 status code', (done) => {
    request(app)
      .post('/news')
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send({ name: '', image: '', description: '' })
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(400);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(Array.isArray(body.errors)).toEqual(true);
        expect(body.errors).toEqual(
          expect.arrayContaining(['field name is required']),
          expect.arrayContaining(['field image is required']),
          expect.arrayContaining(['field description is required'])
        );
        done()
      })
      .catch(err => done(err))
  })

  test('create fail name empty should send response 400 status code', (done) => {
    request(app)
      .post('/news')
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send({ name: '', image: input.image, description: input.description })
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

  test('create fail image empty should send response 400 status code', (done) => {
    request(app)
      .post('/news')
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send({ name: input.name, image: '', description: input.description })
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(400);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(Array.isArray(body.errors)).toEqual(true);
        expect(body.errors).toEqual(
          expect.arrayContaining(['field image is required'])
        );
        done()
      })
      .catch(err => done(err))
  })

  test('create fail description empty should send response 400 status code', (done) => {
    request(app)
      .post('/news')
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send({ name: input.name, image: input.image, description: '' })
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

  test('Register fail no token 500 status code', (done) => {
    request(app)
      .post('/news')
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

  test('Register fail send token but not admin 401 status code', (done) => {
    request(app)
      .post('/news')
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
      .catch(err => {
        console.log(tokenFamily);
        done(err)
      })
  })
})

//READ

describe('GET /news success', () => {
  test('GET news data should send response 200 status code', (done) => {
    request(app)
      .get('/news')
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
              image: input.image,
              description: input.description,
              active: true,
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

describe('GET /news/:id success', () => {
  test('GET news id should send response 200 status code', (done) => {
    request(app)
      .get(`/news/${newsId}`)
      .set('access_token', tokenAdmin)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(200)
        expect(body).toEqual({
          id: expect.any(Number),
          name: input.name,
          image: input.image,
          description: input.description,
          active: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
        done()
      })
      .catch(err => done(err))
  })
})

describe('GET /news/:id fail', () => {
  test('news id not in database should send response 404 status code', (done) => {
    request(app)
      .get('/news/999999999')
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

// UPDATE

describe('PUT /news/:id success', () => {
  const updatedNews = {
    name: 'qweqwe',
    image: '/image.png',
    description: 'qweqweqweqweqwe',
    active: false
  }

  test('PUT groups send response 200 status code', (done) => {
    request(app)
      .put(`/news/${newsId}`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send(updatedNews)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(200)
        expect(typeof body).toEqual('object')
        expect(body).toHaveProperty('id', expect.any(Number))
        expect(body).toHaveProperty('name', updatedNews.name)
        expect(body).toHaveProperty('image', updatedNews.image)
        expect(body).toHaveProperty('description', updatedNews.description)
        done()
      })
      .catch(err => done(err))
  })
})

describe('PUT /news fail', () => {
  test('PUT fail name, image and description should send response 400 status code', (done) => {
    const input = {
      name: '',
      image: '',
      description: '',
      active: false
    }
    request(app)
      .put(`/news/${newsId}`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send(input)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(400);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(Array.isArray(body.errors)).toEqual(true);
        expect(body.errors).toEqual(
          expect.arrayContaining(['field name is required']),
          expect.arrayContaining(['field image is required']),
          expect.arrayContaining(['field description is required'])
        );
        done()
      })
      .catch(err => done(err))
  })

  test('PUT fail name empty should send response 400 status code', (done) => {
    const input = {
      name: '',
      image: '/image.png',
      description: 'qweqweqweqweqwe',
      active: false
    }
    request(app)
      .put(`/news/${newsId}`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send(input)
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

  test('PUT fail image empty should send response 400 status code', (done) => {
    const input = {
      name: 'qweqwe',
      image: '',
      description: 'qweqweqweqweqwe',
      active: false
    }

    request(app)
      .put(`/news/${newsId}`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send(input)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(400);
        expect(typeof body).toEqual('object');
        expect(body).toHaveProperty('errors');
        expect(Array.isArray(body.errors)).toEqual(true);
        expect(body.errors).toEqual(
          expect.arrayContaining(['field image is required'])
        );
        done()
      })
      .catch(err => done(err))
  })

  test('PUT fail description empty should send response 400 status code', (done) => {
    const input = {
      name: 'qweqwe',
      image: '/image/png',
      description: '',
      active: false
    }

    request(app)
      .put(`/news/${newsId}`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send(input)
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

  test('PUT fail no token 500 status code', (done) => {
    request(app)
      .put(`/news/${newsId}`)
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
      .put(`/news/${newsId}`)
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

  test('news id not in database should send response 404 status code', (done) => {
    request(app)
      .put('/news/999999999')
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

// PATCH

describe('PATCH /news/:id success', () => {
  const updatedNews = {
    active: false
  }

  test('PATCH news send response 200 status code', (done) => {
    request(app)
      .patch(`/news/${newsId}`)
      .set('Accept', 'application/json')
      .set('access_token', tokenAdmin)
      .send(updatedNews)
      .then(response => {
        const { body, statusCode } = response

        expect(statusCode).toEqual(200)
        expect(typeof body).toEqual('object')
        expect(body).toHaveProperty('id', expect.any(Number))
        expect(body).toHaveProperty('name', expect.any(String))
        expect(body).toHaveProperty('image', expect.any(String))
        expect(body).toHaveProperty('description', expect.any(String))
        expect(body).toHaveProperty('status', updatedNews.status)
        done()
      })
      .catch(err => done(err))
  })
})

describe('PUT /news fail', () => {
    test('PUT fail active field empty should send response 400 status code', (done) => {
      request(app)
        .patch(`/news/${newsId}`)
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send({ active: '' })
        .then(response => {
          const { body, statusCode } = response
          // console.log('<<<<<<<<<<HAHAHAHAHA', body);
          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field active is required'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('PUT fail no token 500 status code', (done) => {
      request(app)
        .patch(`/news/${newsId}`)
        .set('Accept', 'application/json')
        .send({ active: false })
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
        .patch(`/news/${newsId}`)
        .set('Accept', 'application/json')
        .set('access_token', tokenFamily)
        .send({ active: false })
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(401);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors', 'unauthorize action!');
          done()
        })
        .catch(err => done(err))
    })

    test('news id not in database should send response 404 status code', (done) => {
      request(app)
        .patch('/news/9999')
        .set('access_token', tokenAdmin)
        .send({ active: false })
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

describe('DELETE /news/:id success', () => {
  test('delete success should send response 200 status code', (done) => {
    request(app)
      .delete(`/news/${newsId}`)
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

describe('DELETE /news/:id fail', () => {
  test('no token with 500 status code', (done) => {
    request(app)
      .delete(`/news/${newsId}`)
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
      .delete(`/news/${newsId}`)
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

  test('news id not in database should send response 404 status code', (done) => {
    request(app)
      .delete('/news/999999999')
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