const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const clearClient = require('./helpers/clear-client')

let tokenAdmin, tokenFamily, clientId, familiesIdDummy, groupIdDummy;

const dummyImage = "data:image/jpeg;base64,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"

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

    const inputFamilies = {
      name: 'pevita',
      address: 'alamat pevita dong',
      contact: '0822796251',
      userId: 2,
      gender: 'wanita'
    }

    const inputGroup = {
      name: 'FamTravel',
      year: 2021
    }

    const admins = await request(app)
      .post('/login')
      .send(admin)

    tokenAdmin = admins.body.access_token;

    const families = await request(app)
      .post('/login')
      .send(family)

    tokenFamily = families.body.access_token;

    const familiesPost = await request(app)
      .post('/families')
      .set('access_token', tokenAdmin)
      .send(inputFamilies)

    const groups = await request(app)
      .post('/groups')
      .set('access_token', tokenAdmin)
      .send(inputGroup)


    familiesIdDummy = familiesPost.body.id
    groupIdDummy = groups.body.id

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

  describe('GET /clients success', () => {
    test('should send response with 200 status code', (done) => {

      request(app)
        .get('/clients')
        .set('access_token', tokenAdmin)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(200);
          expect(Array.isArray(body)).toEqual(true);
          done();
        }).catch(err => done(err));
    });
  });

  describe('GET /clients/:id success', () => {
    test('should send response with 200 status code', async(done) => {
      const input = {
        name: 'Abdul Aziz',
        img: dummyImage,
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        familiesId: familiesIdDummy,
        groupId: groupIdDummy,
        birth_date: new Date()
      }

      const storeOne = await request(app)
        .post('/clients')
        .set('access_token', tokenAdmin)
        .send(input)

      const id = storeOne.body.id;

      await request(app)
        .get(`/clients/${id}`)
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
          expect(body).toHaveProperty('birth_date');
          expect(body).toHaveProperty('familiesId', input.familiesId);
          done();
        }).catch(err => done(err));
    });
  });

  describe('GET /clients/:id fail', () => {
    test('not found id should send response with 404 status code', (done) => {

      request(app)
        .get(`/clients/9999999`)
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

  describe('POST /clients success', () => {
    test('should send response with 201 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: dummyImage,
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        familiesId: familiesIdDummy,
        groupId: groupIdDummy,
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
          expect(body).toHaveProperty('familiesId', body.familiesId);
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
        familiesId: familiesIdDummy,
        groupId: groupIdDummy,
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
        familiesId: familiesIdDummy,
        groupId: groupIdDummy,
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

    test('store clients fail name, address, gender, contact, birth date, families id, group id empty should send response 400 status code', (done) => {
      const input = {
        name: '',
        img: '',
        address: '',
        gender: '',
        contact: '',
        familiesId: '',
        groupId: '',
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
            expect.arrayContaining(['field birth date is required']),
            expect.arrayContaining(['field family id is required']),
            expect.arrayContaining(['field group id is required'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('store clients fail address empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: dummyImage,
        address: '',
        gender: 'pria',
        contact: '082279655366',
        familiesId: familiesIdDummy,
        groupId: groupIdDummy,
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
        img: dummyImage,
        address: 'jln. bangau',
        gender: '',
        contact: '082279655366',
        familiesId: familiesIdDummy,
        groupId: groupIdDummy,
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
        img: dummyImage,
        address: 'jln. bangau',
        gender: 'pria',
        contact: '',
        familiesId: familiesIdDummy,
        groupId: groupIdDummy,
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

    test('store clients fail birth date empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: dummyImage,
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        familiesId: familiesIdDummy,
        groupId: groupIdDummy,
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

    test('store clients fail family id empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: dummyImage,
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        familiesId: '',
        groupId: groupIdDummy,
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
            expect.arrayContaining(['field family id is required'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('store clients fail group id empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: dummyImage,
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        familiesId: familiesIdDummy,
        groupId: '',
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
            expect.arrayContaining(['field group id is required'])
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
        img: 'http://res.cloudinary.com/dyni7r1ab/image/upload/v1613967756/hjysdypb3vlzvd5z3olo.jpg',
        address: 'jln. bangauz',
        gender: 'wanita',
        contact: '082279655368',
        familiesId: familiesIdDummy,
        groupId: groupIdDummy,
        birth_date: new Date()
      }

      request(app)
        .put(`/clients/${clientId}`)
        .set('access_token', tokenAdmin)
        .send(input)
        .then(response => {
          const { body, statusCode } = response

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
          expect(body).toHaveProperty('familiesId', body.familiesId);
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
        familiesId: familiesIdDummy,
        groupId: groupIdDummy,
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
        familiesId: familiesIdDummy,
        groupId: groupIdDummy,
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

    test('update clients fail name, address, gender, contact, birth date, families id, group id empty should send response 400 status code', (done) => {
      const input = {
        name: '',
        img: '',
        address: '',
        gender: '',
        contact: '',
        familiesId: '',
        groupId: '',
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
            expect.arrayContaining(['field birth date is required']),
            expect.arrayContaining(['field family id is required']),
            expect.arrayContaining(['field group id is required']),
          );
          done()
        })
        .catch(err => done(err))
    })

    test('update clients fail address empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: dummyImage,
        address: '',
        gender: 'pria',
        contact: '082279655366',
        familiesId: familiesIdDummy,
        groupId: groupIdDummy,
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
        img: dummyImage,
        address: 'jln. bangau',
        gender: '',
        contact: '082279655366',
        familiesId: familiesIdDummy,
        groupId: groupIdDummy,
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
        img: dummyImage,
        address: 'jln. bangau',
        gender: 'pria',
        contact: '',
        familiesId: familiesIdDummy,
        groupId: groupIdDummy,
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

    test('update clients fail birth date empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: dummyImage,
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        familiesId: familiesIdDummy,
        groupId: groupIdDummy,
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

    test('update clients fail family id empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: dummyImage,
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        familiesId: '',
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
            expect.arrayContaining(['field family id is required'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('update clients fail group id empty should send response 400 status code', (done) => {
      const input = {
        name: 'Abdul Aziz',
        img: dummyImage,
        address: 'jln. bangau',
        gender: 'pria',
        contact: '082279655366',
        familiesId: familiesIdDummy,
        groupId: '',
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
            expect.arrayContaining(['field group id is required'])
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