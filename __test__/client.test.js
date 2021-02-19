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
    test('store clients fail name, img, address, gender, contact, birth_date empty should send response 400 status code', (done) => {
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
            expect.arrayContaining(['field birth date is required'])
          );
          done()
        })
        .catch(err => done(err))
    })
  });
});