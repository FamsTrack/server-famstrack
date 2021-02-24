const request = require('supertest');
const app = require('../app')
const { sequelize } = require('../models')
const clearNews = require('./helpers/clear-news')

const input = {
  name: 'Qui potest igitur habitare in beata vita summi mali metus?',
  image: "data:image/jpeg;base64,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",
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
          image: body.image,
          name: input.name,
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