const request = require('supertest')
const app = require('../app')

const { sequelize } = require('../models')
const clearFamilies = require('./helpers/clear-family')

let tokenAdmin, tokenFamily, familiesId;

describe('Families', () => {
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

    const families = await request(app)
      .post('/login')
      .send(family)

    tokenFamily = families.body.access_token;

    done();
  })

  afterAll(async(done) => {
    try {
      await clearFamilies();
      await sequelize.close();
      done();
    } catch (error) {
      done(error);
    }
  })

  describe('GET /families success', () => {
    test('should send response with 200 status code', (done) => {

      request(app)
        .get('/families')
        .set('access_token', tokenAdmin)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(200);
          expect(Array.isArray(body)).toEqual(true);
          done();
        }).catch(err => done(err));
    });
  });

  describe('GET /families/:id success', () => {
    test('should send response with 200 status code', async(done) => {
      const input = {
        name: 'Abdul Aziz',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        userId: 2
      }

      const storeOne = await request(app)
        .post('/families')
        .set('access_token', tokenAdmin)
        .send(input)

      const id = storeOne.body.id;

      await request(app)
        .get(`/families/${id}`)
        .set('access_token', tokenAdmin)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(200);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('id');
          expect(typeof body.id).toEqual('number');
          expect(body).toHaveProperty('name', input.name);
          expect(body).toHaveProperty('address', input.address);
          expect(body).toHaveProperty('gender', input.gender);
          expect(body).toHaveProperty('contact', input.contact);
          expect(body).toHaveProperty('userId', input.userId);
          done();
        }).catch(err => done(err));
    });
  });

  describe('GET /families/:id fail', () => {
    test('not found id should send response with 404 status code', (done) => {

      request(app)
        .get(`/families/9999999`)
        .set('access_token', tokenAdmin)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(404);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(typeof body.errors).toEqual('string');
          expect(body.errors).toEqual('not found!');
          done();
        }).catch(err => done(err));
    });
  });

  describe('GET /families/user/:userId success', () => {
    test('should send response with 200 status code', async(done) => {

      await request(app)
        .get(`/families/user/2`)
        .set('access_token', tokenAdmin)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(200);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('id');
          expect(typeof body.id).toEqual('number');
          expect(body).toHaveProperty('name');
          expect(body).toHaveProperty('address');
          expect(body).toHaveProperty('gender');
          expect(body).toHaveProperty('contact');
          expect(body).toHaveProperty('userId');
          done();
        }).catch(err => done(err));
    });
  });

  describe('GET /families/user/:userId fail', () => {
    test('not found id should send response with 404 status code', (done) => {

      request(app)
        .get(`/families/user/9999999`)
        .set('access_token', tokenAdmin)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(404);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(typeof body.errors).toEqual('string');
          expect(body.errors).toEqual('not found!');
          done();
        }).catch(err => done(err));
    });
  });

  describe('POST /families success', () => {
    test('should send response with 201 status code', (done) => {
      const input = {
        name: 'Papa pevita',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        userId: 2,
      }

      request(app)
        .post('/families')
        .set('access_token', tokenAdmin)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          familiesId = body.id

          expect(statusCode).toEqual(201);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('id');
          expect(typeof body.id).toEqual('number');
          expect(body).toHaveProperty('name', body.name);
          expect(body).toHaveProperty('address', body.address);
          expect(body).toHaveProperty('gender', body.gender);
          expect(body).toHaveProperty('contact', body.contact);
          expect(body).toHaveProperty('userId', body.userId);
          done();
        }).catch(err => done(err));
    });
  });

  describe('POST /families fail', () => {
    test('jwt not provided should send response with 500 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        userId: 2
      }

      request(app)
        .post('/families')
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(500);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(typeof body.errors).toEqual('string');
          expect(body.errors).toEqual('jwt must be provided');
          done();
        }).catch(err => done(err));
    });

    test('unauthorize action should send response 401 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        userId: 2
      }

      request(app)
        .post('/families')
        .set('access_token', tokenFamily)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(401);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(typeof body.errors).toEqual('string');
          expect(body.errors).toEqual('unauthorize action!');
          done();
        }).catch(err => done(err));
    });

    test('store families fail name, address, gender, contact empty should send response 400 status code', (done) => {
      const input = {
        name: '',
        address: '',
        gender: '',
        contact: '',
        userId: ''
      }
      request(app)
        .post('/families')
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
            expect.arrayContaining(['field address is required']),
            expect.arrayContaining(['field password is required']),
            expect.arrayContaining(['gender should be one of pria or wanita']),
            expect.arrayContaining(['field contact is required']),
            expect.arrayContaining(['field user id is required'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('store families fail address empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        address: '',
        gender: 'pria',
        contact: '082279655366',
        userId: 2
      }
      request(app)
        .post('/families')
        .set('access_token', tokenAdmin)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field address is required']),
          );
          done()
        })
        .catch(err => done(err))
    })

    test('store families fail gender empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        address: 'jln. bangau',
        gender: '',
        contact: '082279655366',
        userId: 2
      }
      request(app)
        .post('/families')
        .set('access_token', tokenAdmin)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['gender should be one of pria or wanita']),
          );
          done()
        })
        .catch(err => done(err))
    })

    test('store families fail contact empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '',
        userId: 2
      }
      request(app)
        .post('/families')
        .set('access_token', tokenAdmin)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field contact is required']),
          );
          done()
        })
        .catch(err => done(err))
    })

    test('store families fail user id empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        userId: ''
      }

      request(app)
        .post('/families')
        .set('access_token', tokenAdmin)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field user id is required'])
          );
          done()
        }).catch(err => done(err))
    })
  });

  describe('PUT /families success', () => {
    test('should send response with 200 status code', (done) => {
      const input = {
        name: 'Abdul ajex',
        img: 'imagez.jpg',
        address: 'jln. bangauz',
        gender: 'wanita',
        contact: '082279655368',
        userId: 2
      }

      request(app)
        .put(`/families/${familiesId}`)
        .set('access_token', tokenAdmin)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(200);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('id');
          expect(typeof body.id).toEqual('number');
          expect(body).toHaveProperty('name', body.name);
          expect(body).toHaveProperty('address', body.address);
          expect(body).toHaveProperty('gender', body.gender);
          expect(body).toHaveProperty('contact', body.contact);
          expect(body).toHaveProperty('userId', body.userId);
          done();

        }).catch(err => done(err));
    });
  });

  describe('PUT /families fail', () => {
    test('jwt not provided should send response with 500 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        userId: 2
      }

      request(app)
        .put(`/families/${familiesId}`)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(500);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(typeof body.errors).toEqual('string');
          expect(body.errors).toEqual('jwt must be provided');
          done();
        }).catch(err => done(err));
    });

    test('unauthorize action should send response 401 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        userId: 2
      }

      request(app)
        .put(`/families/${familiesId}`)
        .set('access_token', tokenFamily)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(401);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(typeof body.errors).toEqual('string');
          expect(body.errors).toEqual('unauthorize action!');
          done();
        }).catch(err => done(err));
    });

    test('update families fail name, address, gender, contact empty should send response 400 status code', (done) => {
      const input = {
        name: '',
        address: '',
        gender: '',
        contact: '',
        userId: '',
      }
      request(app)
        .put(`/families/${familiesId}`)
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
            expect.arrayContaining(['field address is required']),
            expect.arrayContaining(['field password is required']),
            expect.arrayContaining(['gender should be one of pria or wanita']),
            expect.arrayContaining(['field contact is required']),
            expect.arrayContaining(['field user id is required'])

          );
          done()
        })
        .catch(err => done(err))
    })

    test('update families fail address empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: '',
        gender: 'pria',
        contact: '082279655366',
        userId: 2
      }
      request(app)
        .put(`/families/${familiesId}`)
        .set('access_token', tokenAdmin)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field address is required']),
          );
          done()
        })
        .catch(err => done(err))
    })

    test('update families fail gender empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: 'jln. bangau',
        gender: '',
        contact: '082279655366',
        userId: 2
      }
      request(app)
        .put(`/families/${familiesId}`)
        .set('access_token', tokenAdmin)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['gender should be one of pria or wanita']),
          );
          done()
        })
        .catch(err => done(err))
    })

    test('update families fail contact empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '',
        userId: 2
      }
      request(app)
        .put(`/families/${familiesId}`)
        .set('access_token', tokenAdmin)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field contact is required']),
          );
          done()
        })
        .catch(err => done(err))
    })

    test('update families fail user id empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        userId: '',
      }
      request(app)
        .put(`/families/${familiesId}`)
        .set('access_token', tokenAdmin)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field user id is required'])
          );
          done()
        })
        .catch(err => done(err))
    })
  });

  describe('DELETE /families success', () => {
    test('delete success should send response with 200 status code', (done) => {
      request(app)
        .delete(`/families/${familiesId}`)
        .set('access_token', tokenAdmin)
        .then(response => {

          const { body, statusCode } = response
          expect(statusCode).toEqual(200);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('message');
          expect(typeof body.message).toEqual('string');
          expect(body.message).toEqual('successfully delete family');

          done()
        }).catch(err => done(err))
    });
  });


  describe('DELETE /families fail', () => {
    test('unauthorize action role not admin should send response with 401 status code', (done) => {
      request(app)
        .delete(`/families/${familiesId}`)
        .set('access_token', tokenFamily)
        .then(response => {

          const { body, statusCode } = response

          expect(statusCode).toEqual(401);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(typeof body.errors).toEqual('string');
          expect(body.errors).toEqual('unauthorize action!');

          done();
        }).catch(err => done(err))
    });


    test('families not found should send response with 404 status code', (done) => {
      request(app)
        .delete(`/families/9999999`)
        .set('access_token', tokenAdmin)
        .then(response => {

          const { body, statusCode } = response

          expect(statusCode).toEqual(404);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(typeof body.errors).toEqual('string');
          expect(body.errors).toEqual('not found!');

          done();
        }).catch(err => done(err))
    });

    test('jwt not provided should send response with 500 status code', (done) => {
      // EXECUTE
      request(app)
        .delete(`/families/${familiesId}`)
        .then(response => {
          const { body, statusCode } = response

          // ASSERT
          expect(statusCode).toEqual(500);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(typeof body.errors).toEqual('string');
          expect(body.errors).toEqual('jwt must be provided');

          done();
        }).catch(err => done(err))
    });
  });
})