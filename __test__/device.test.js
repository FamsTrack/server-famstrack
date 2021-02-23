const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const clearDevice = require('./helpers/clear-device')

let tokenAdmin, tokenFamily, deviceId, arduinoUniqueKey;

describe('Devices', () => {

  beforeAll(async(done) => {
    const admin = {
      email: 'admin@famtrack.com',
      password: 'qwerty'
    }

    const family = {
      email: 'pevitapearce@famtrack.com',
      password: 'qwerty'
    }

    const newDevice = {
      longitude: 110.371754,
      latitude: -7.795424,
      panicStatus: false,
      buzzerStatus: false,
      arduinoUniqueKey: 'QWERTY12345'
    }

    const admins = await request(app)
      .post('/login')
      .send(admin)


    tokenAdmin = admins.body.access_token;

    const arduinoDummy = await request(app)
      .post('/devices')
      .set('access_token', tokenAdmin)
      .send(newDevice)

    const families = await request(app)
      .post('/login')
      .send(family)

    tokenFamily = families.body.access_token;
    arduinoUniqueKey = arduinoDummy.body.arduinoUniqueKey

    done();
  })

  afterAll(async(done) => {
    try {
      await clearDevice();
      await sequelize.close();
      done();
    } catch (error) {
      done(error);
    }
  })

  describe('GET /devices success', () => {
    test('should send response with 200 status code', (done) => {

      request(app)
        .get('/devices')
        .set('access_token', tokenAdmin)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(200);
          expect(Array.isArray(body)).toEqual(true);
          done();
        }).catch(err => done(err));
    });
  });

  describe('GET /devices/:id success', () => {
    test('should send response with 200 status code', async(done) => {
      const newDevice = {
        longitude: 110.371759,
        latitude: -7.795429,
        panicStatus: true,
        buzzerStatus: true,
        arduinoUniqueKey: 'qwert12345z',
      }

      const storeOne = await request(app)
        .post('/devices')
        .set('access_token', tokenAdmin)
        .send(newDevice)

      const id = storeOne.body.id;

      await request(app)
        .get(`/devices/${id}`)
        .set('access_token', tokenAdmin)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(200);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('id');
          expect(typeof body.id).toEqual('number');
          expect(body).toHaveProperty('longitude', newDevice.longitude);
          expect(body).toHaveProperty('latitude', newDevice.latitude);
          expect(body).toHaveProperty('panicStatus', newDevice.panicStatus);
          expect(body).toHaveProperty('buzzerStatus', newDevice.buzzerStatus);
          expect(body).toHaveProperty('arduinoUniqueKey', newDevice.arduinoUniqueKey);
          done();
        }).catch(err => done(err));
    });
  });

  describe('GET /devices/:id fail', () => {
    test('not found id should send response with 404 status code', (done) => {

      request(app)
        .get(`/devices/9999999`)
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

  describe('POST /device success', () => {
    const newDevice = {
      longitude: 110.371754,
      latitude: -7.795424,
      panicStatus: false,
      buzzerStatus: false,
      arduinoUniqueKey: 'qwert12345',
    }
    test('should send response with 201 status code', (done) => {
      request(app)
        .post('/devices')
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          deviceId = body.id

          expect(statusCode).toBe(201)
          expect(body).toHaveProperty('id', expect.any(Number))
          expect(body).toHaveProperty('arduinoUniqueKey', newDevice.arduinoUniqueKey)
          expect(body).toHaveProperty('longitude', newDevice.longitude)
          expect(body).toHaveProperty('latitude', newDevice.latitude)
          expect(body).toHaveProperty('panicStatus', newDevice.panicStatus)
          expect(body).toHaveProperty('buzzerStatus', newDevice.buzzerStatus)

          done()
        })
        .catch(err => done(err))
    })
  })

  describe('POST /device fail', () => {
    test('jwt not provided should send response with 500 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: -7.795424,
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: 'qwert12345'
      }
      request(app)
        .post('/devices')
        .set('Accept', 'application/json')
        .send(newDevice)
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

    test('unique arduino unique key should send response with 500 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: -7.795424,
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: 'QWERTY12345'
      }
      request(app)
        .post('/devices')
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['arduinoUniqueKey must be unique'])
          );
          done();
        })
        .catch(err => done(err))
    })

    test('client id not found should send response with 400 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: -7.795424,
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: 'QWERTY123458',
        clientId: 99999
      }
      request(app)
        .post('/devices')
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(404);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(typeof body.errors).toEqual('string');
          expect(body.errors).toEqual('not found!');
          done();
        })
        .catch(err => done(err))
    })

    test('unauthorize action should send response 401 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: -7.795424,
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: ''
      }

      request(app)
        .post('/devices')
        .set('access_token', tokenFamily)
        .send(newDevice)
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

    test('store devices fail longitude, latitude, panicStatus, buzzerStatus, arduinoUniqueKey empty should send response 400 status code', (done) => {
      const newDevice = {
        longitude: '',
        latitude: '',
        panicStatus: '',
        buzzerStatus: '',
        arduinoUniqueKey: ''
      }

      request(app)
        .post('/devices')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field longitude is required']),
            expect.arrayContaining(['field latitude is required']),
            expect.arrayContaining(['field panicStatus is required']),
            expect.arrayContaining(['field buzzerStatus is required']),
            expect.arrayContaining(['field arduino unique key is required']),
            expect.arrayContaining(['field longitude must float']),
            expect.arrayContaining(['field latitude must float'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('store arduinoUniqueKey fail address empty should send response 400 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: -7.795424,
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: ''
      }

      request(app)
        .post('/devices')
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field arduino unique key is required']),
          );
          done()
        })
        .catch(err => done(err))
    })

    test('store device fail longitude empty should send response 400 status code', (done) => {
      const newDevice = {
        longitude: '',
        latitude: -7.795424,
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: 'QWERTY1234'
      }

      request(app)
        .post('/devices')
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field longitude is required']),
            expect.arrayContaining(['field longitude must float'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('store device fail latitude empty should send response 400 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: '',
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: 'QWERTY1234'
      }

      request(app)
        .post('/devices')
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field latitude is required']),
            expect.arrayContaining(['field latitude must float'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('store device fail panicStatus empty should send response 400 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: -7.795424,
        panicStatus: '',
        buzzerStatus: false,
        arduinoUniqueKey: 'QWERTY1234'
      }

      request(app)
        .post('/devices')
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field panic status is required'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('store device fail buzzerStatus empty should send response 400 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: -7.795424,
        panicStatus: false,
        buzzerStatus: '',
        arduinoUniqueKey: 'QWERTY1234'
      }

      request(app)
        .post('/devices')
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field buzzer status is required'])
          );
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('PATCH /device success', () => {
    test('should send response with 200 status code', (done) => {
      request(app)
        .get(`/devices/${arduinoUniqueKey}/key?latitude=221.1111122&longitude=22111.111111`)
        .set('Accept', 'application/json')
        .then(response => {
          const { statusCode } = response

          expect(statusCode).toBe(200)

          done()
        })
        .catch(err => done(err))
    })
  })

  // describe('PATCH /devices fail', () => {
  //   test('update devices fail longitude, latitude, panicStatus, buzzerStatus empty should send response 400 status code', (done) => {
  //     const newDevice = {
  //       longitude: '',
  //       latitude: '',
  //       panicStatus: '',
  //       buzzerStatus: '',
  //     }

  //     request(app)
  //       .patch(`/devices/${deviceId}`)
  //       .set('access_token', tokenAdmin)
  //       .send(newDevice)
  //       .then(response => {
  //         const { body, statusCode } = response

  //         expect(statusCode).toEqual(400);
  //         expect(typeof body).toEqual('object');
  //         expect(body).toHaveProperty('errors');
  //         expect(Array.isArray(body.errors)).toEqual(true);
  //         expect(body.errors).toEqual(
  //           expect.arrayContaining(['field longitude is required']),
  //           expect.arrayContaining(['field latitude is required']),
  //           expect.arrayContaining(['field panicStatus is required']),
  //           expect.arrayContaining(['field buzzerStatus is required']),
  //           expect.arrayContaining(['field longitude must float']),
  //           expect.arrayContaining(['field latitude must float'])
  //         );
  //         done()
  //       })
  //       .catch(err => done(err))
  //   })

  //   test('patch device fail longitude empty should send response 400 status code', (done) => {
  //     const newDevice = {
  //       longitude: '',
  //       latitude: -7.795424,
  //       panicStatus: false,
  //       buzzerStatus: false
  //     }

  //     request(app)
  //       .patch(`/devices/${deviceId}`)
  //       .set('Accept', 'application/json')
  //       .set('access_token', tokenAdmin)
  //       .send(newDevice)
  //       .then(response => {
  //         const { body, statusCode } = response

  //         expect(statusCode).toEqual(400);
  //         expect(typeof body).toEqual('object');
  //         expect(body).toHaveProperty('errors');
  //         expect(Array.isArray(body.errors)).toEqual(true);
  //         expect(body.errors).toEqual(
  //           expect.arrayContaining(['field longitude is required']),
  //           expect.arrayContaining(['field longitude must float'])
  //         );
  //         done()
  //       })
  //       .catch(err => done(err))
  //   })

  //   test('patch device fail latitude empty should send response 400 status code', (done) => {
  //     const newDevice = {
  //       longitude: 110.371754,
  //       latitude: '',
  //       panicStatus: false,
  //       buzzerStatus: false
  //     }

  //     request(app)
  //       .patch(`/devices/${deviceId}`)
  //       .set('Accept', 'application/json')
  //       .set('access_token', tokenAdmin)
  //       .send(newDevice)
  //       .then(response => {
  //         const { body, statusCode } = response

  //         expect(statusCode).toEqual(400);
  //         expect(typeof body).toEqual('object');
  //         expect(body).toHaveProperty('errors');
  //         expect(Array.isArray(body.errors)).toEqual(true);
  //         expect(body.errors).toEqual(
  //           expect.arrayContaining(['field latitude is required']),
  //           expect.arrayContaining(['field latitude must float'])
  //         );
  //         done()
  //       })
  //       .catch(err => done(err))
  //   })

  //   test('patch device fail panicStatus empty should send response 400 status code', (done) => {
  //     const newDevice = {
  //       longitude: 110.371754,
  //       latitude: -7.795424,
  //       panicStatus: '',
  //       buzzerStatus: false,
  //     }

  //     request(app)
  //       .patch(`/devices/${deviceId}`)
  //       .set('Accept', 'application/json')
  //       .set('access_token', tokenAdmin)
  //       .send(newDevice)
  //       .then(response => {
  //         const { body, statusCode } = response

  //         expect(statusCode).toEqual(400);
  //         expect(typeof body).toEqual('object');
  //         expect(body).toHaveProperty('errors');
  //         expect(Array.isArray(body.errors)).toEqual(true);
  //         expect(body.errors).toEqual(
  //           expect.arrayContaining(['field panic status is required'])
  //         );
  //         done()
  //       })
  //       .catch(err => done(err))
  //   })

  //   test('patch device fail buzzerStatus empty should send response 400 status code', (done) => {
  //     const newDevice = {
  //       longitude: 110.371754,
  //       latitude: -7.795424,
  //       panicStatus: false,
  //       buzzerStatus: '',
  //     }

  //     request(app)
  //       .patch(`/devices/${deviceId}`)
  //       .set('Accept', 'application/json')
  //       .set('access_token', tokenAdmin)
  //       .send(newDevice)
  //       .then(response => {
  //         const { body, statusCode } = response

  //         expect(statusCode).toEqual(400);
  //         expect(typeof body).toEqual('object');
  //         expect(body).toHaveProperty('errors');
  //         expect(Array.isArray(body.errors)).toEqual(true);
  //         expect(body.errors).toEqual(
  //           expect.arrayContaining(['field buzzer status is required'])
  //         );
  //         done()
  //       })
  //       .catch(err => done(err))
  //   })
  // })

  describe('PUT /device success', () => {
    const newDevice = {
      longitude: 110.371755,
      latitude: -7.795425,
      panicStatus: true,
      buzzerStatus: true,
      arduinoUniqueKey: 'qwert12345',
    }
    test('should send response with 200 status code', (done) => {
      request(app)
        .put(`/devices/${deviceId}`)
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toBe(200)
          expect(body).toHaveProperty('id', expect.any(Number))
          expect(body).toHaveProperty('arduinoUniqueKey', newDevice.arduinoUniqueKey)
          expect(body).toHaveProperty('longitude', newDevice.longitude)
          expect(body).toHaveProperty('latitude', newDevice.latitude)
          expect(body).toHaveProperty('panicStatus', newDevice.panicStatus)
          expect(body).toHaveProperty('buzzerStatus', newDevice.buzzerStatus)

          done()
        })
        .catch(err => done(err))
    })
  })

  describe('PUT /device fail', () => {
    test('jwt not provided should send response with 500 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: -7.795424,
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: 'qwert12345'
      }
      request(app)
        .put(`/devices/${deviceId}`)
        .set('Accept', 'application/json')
        .send(newDevice)
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

    test('unique arduino unique key should send response with 500 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: -7.795424,
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: 'QWERTY12345'
      }
      request(app)
        .put(`/devices/${deviceId}`)
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['arduinoUniqueKey must be unique'])
          );
          done();
        })
        .catch(err => done(err))
    })

    test('client id not found should send response with 400 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: -7.795424,
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: 'QWERTY123458',
        clientId: 99999
      }
      request(app)
        .put(`/devices/${deviceId}`)
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(404);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(typeof body.errors).toEqual('string');
          expect(body.errors).toEqual('not found!');
          done();
        })
        .catch(err => done(err))
    })

    test('unauthorize action should send response 401 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: -7.795424,
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: ''
      }

      request(app)
        .put(`/devices/${deviceId}`)
        .set('access_token', tokenFamily)
        .send(newDevice)
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

    test('update devices fail longitude, latitude, panicStatus, buzzerStatus, arduinoUniqueKey empty should send response 400 status code', (done) => {
      const newDevice = {
        longitude: '',
        latitude: '',
        panicStatus: '',
        buzzerStatus: '',
        arduinoUniqueKey: ''
      }

      request(app)
        .put(`/devices/${deviceId}`)
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field longitude is required']),
            expect.arrayContaining(['field latitude is required']),
            expect.arrayContaining(['field panicStatus is required']),
            expect.arrayContaining(['field buzzerStatus is required']),
            expect.arrayContaining(['field arduino unique key is required']),
            expect.arrayContaining(['field longitude must float']),
            expect.arrayContaining(['field latitude must float'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('update arduinoUniqueKey fail address empty should send response 400 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: -7.795424,
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: ''
      }

      request(app)
        .put(`/devices/${deviceId}`)
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field arduino unique key is required']),
          );
          done()
        })
        .catch(err => done(err))
    })

    test('update device fail longitude empty should send response 400 status code', (done) => {
      const newDevice = {
        longitude: '',
        latitude: -7.795424,
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: 'QWERTY1234'
      }

      request(app)
        .put(`/devices/${deviceId}`)
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field longitude is required']),
            expect.arrayContaining(['field longitude must float'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('update device fail latitude empty should send response 400 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: '',
        panicStatus: false,
        buzzerStatus: false,
        arduinoUniqueKey: 'QWERTY1234'
      }

      request(app)
        .put(`/devices/${deviceId}`)
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field latitude is required']),
            expect.arrayContaining(['field latitude must float'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('update device fail panicStatus empty should send response 400 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: -7.795424,
        panicStatus: '',
        buzzerStatus: false,
        arduinoUniqueKey: 'QWERTY1234'
      }

      request(app)
        .put(`/devices/${deviceId}`)
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field panic status is required'])
          );
          done()
        })
        .catch(err => done(err))
    })

    test('update device fail buzzerStatus empty should send response 400 status code', (done) => {
      const newDevice = {
        longitude: 110.371754,
        latitude: -7.795424,
        panicStatus: false,
        buzzerStatus: '',
        arduinoUniqueKey: 'QWERTY1234'
      }

      request(app)
        .put(`/devices/${deviceId}`)
        .set('Accept', 'application/json')
        .set('access_token', tokenAdmin)
        .send(newDevice)
        .then(response => {
          const { body, statusCode } = response

          expect(statusCode).toEqual(400);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('errors');
          expect(Array.isArray(body.errors)).toEqual(true);
          expect(body.errors).toEqual(
            expect.arrayContaining(['field buzzer status is required'])
          );
          done()
        })
        .catch(err => done(err))
    })
  })

  // DELETE
  describe('DELETE /devices success', () => {
    test('delete success should send response with 200 status code', (done) => {
      request(app)
        .delete(`/devices/${deviceId}`)
        .set('access_token', tokenAdmin)
        .then(response => {

          const { body, statusCode } = response
          expect(statusCode).toEqual(200);
          expect(typeof body).toEqual('object');
          expect(body).toHaveProperty('message');
          expect(typeof body.message).toEqual('string');
          expect(body.message).toEqual('successfully delete device');

          done()
        }).catch(err => done(err))
    });
  });


  describe('DELETE /devices fail', () => {
    test('unauthorize action role not admin should send response with 401 status code', (done) => {
      request(app)
        .delete(`/devices/${deviceId}`)
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


    test('devices not found should send response with 404 status code', (done) => {
      request(app)
        .delete(`/devices/9999999`)
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
        .delete(`/devices/${deviceId}`)
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

// PATCH