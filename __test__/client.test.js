const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const clearClient = require('./helpers/clear-client')

let tokenAdmin, tokenFamily, clientId;

describe('Client', () => {
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
      await clearClient();
      await sequelize.close();
      done();
    } catch (error) {
      done(error);
    }
  })

  describe('POST /clients success', () => {
    test('should send response with 201 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        birth_date: new Date()
      }

      request(app)
        .post('/clients')
        .set('access_token', tokenAdmin)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          clientId = body.id

          expect(statusCode).toEqual(201);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('id');
          expect(typeof body.id).toEqual('number');
          expect(body).toHaveProperty('name', body.name);
          expect(body).toHaveProperty('img', body.img);
          expect(body).toHaveProperty('address', body.address);
          expect(body).toHaveProperty('gender', body.gender);
          expect(body).toHaveProperty('contact', body.contact);
          expect(body).toHaveProperty('birth_date', body.birth_date);
          done();
        }).catch(err => done(err));
    });
  });

  describe('POST /clients fail', () => {
    test('jwt not provided should send response with 500 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        birth_date: new Date()
      }

      request(app)
        .post('/clients')
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
        birth_date: new Date()
      }

      request(app)
        .post('/clients')
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

    test('store clients fail name, address, gender, contact, birth date empty should send response 400 status code', (done) => {
      const input = {
        name: '',
        img: '',
        address: '',
        gender: '',
        contact: '',
        birth_date: ''
      }
      request(app)
        .post('/clients')
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
            expect.arrayContaining(['field birth date is required'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('store clients fail address empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: '',
        gender: 'pria',
        contact: '082279655366',
        birth_date: new Date()
      }
      request(app)
        .post('/clients')
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

    test('store clients fail gender empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: 'jln. bangau',
        gender: '',
        contact: '082279655366',
        birth_date: new Date()
      }
      request(app)
        .post('/clients')
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

    test('store clients fail contact empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '',
        birth_date: new Date()
      }
      request(app)
        .post('/clients')
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

    test('store clients fail contact empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        birth_date: ''
      }
      request(app)
        .post('/clients')
        .set('access_token', tokenAdmin)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field birth date is required'])
          );
          done()
        })
        .catch(err => done(err))
    })
  });

  describe('PUT /clients success', () => {
    test('should send response with 200 status code', (done) => {
      const input = {
        name: 'Abdul ajex',
        img: 'imagez.jpg',
        address: 'jln. bangauz',
        gender: 'wanita',
        contact: '082279655368',
        birth_date: new Date()
      }

      request(app)
        .put(`/clients/${clientId}`)
        .set('access_token', tokenAdmin)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          clientId = body.id

          expect(statusCode).toEqual(200);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('id');
          expect(typeof body.id).toEqual('number');
          expect(body).toHaveProperty('name', body.name);
          expect(body).toHaveProperty('img', body.img);
          expect(body).toHaveProperty('address', body.address);
          expect(body).toHaveProperty('gender', body.gender);
          expect(body).toHaveProperty('contact', body.contact);
          expect(body).toHaveProperty('birth_date', body.birth_date);
          done();

        }).catch(err => done(err));
    });
  });

  describe('PUT /clients fail', () => {
    test('jwt not provided should send response with 500 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        birth_date: new Date()
      }

      request(app)
        .put(`/clients/${clientId}`)
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
        birth_date: new Date()
      }

      request(app)
        .put(`/clients/${clientId}`)
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

    test('update clients fail name, address, gender, contact, birth date empty should send response 400 status code', (done) => {
      const input = {
        name: '',
        img: '',
        address: '',
        gender: '',
        contact: '',
        birth_date: ''
      }
      request(app)
        .put(`/clients/${clientId}`)
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
            expect.arrayContaining(['field birth date is required'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('update clients fail address empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: '',
        gender: 'pria',
        contact: '082279655366',
        birth_date: new Date()
      }
      request(app)
        .put(`/clients/${clientId}`)
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

    test('update clients fail gender empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: 'jln. bangau',
        gender: '',
        contact: '082279655366',
        birth_date: new Date()
      }
      request(app)
        .put(`/clients/${clientId}`)
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

    test('update clients fail contact empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '',
        birth_date: new Date()
      }
      request(app)
        .put(`/clients/${clientId}`)
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

    test('update clients fail contact empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: 'image.jpg',
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        birth_date: ''
      }
      request(app)
        .put(`/clients/${clientId}`)
        .set('access_token', tokenAdmin)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field birth date is required'])
          );
          done()
        })
        .catch(err => done(err))
    })
  });

  describe('DELETE /clients success', () => {
    test('delete success should send response with 200 status code', (done) => {
      request(app)
        .delete(`/clients/${clientId}`)
        .set('access_token', tokenAdmin)
        .then(response => {

          const { body, statusCode } = response
          expect(statusCode).toEqual(200);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('message');
          expect(typeof body.message).toEqual('string');
          expect(body.message).toEqual('successfully delete client');

          done()
        }).catch(err => done(err))
    });
  });


  describe('DELETE /clients fail', () => {
    test('unauthorize action role not admin should send response with 401 status code', (done) => {
      request(app)
        .delete(`/clients/${clientId}`)
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


    test('clients not found should send response with 404 status code', (done) => {
      request(app)
        .delete(`/clients/9999999`)
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
        .delete(`/clients/${clientId}`)
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


});