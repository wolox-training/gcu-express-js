const request = require('supertest');
const jwt = require('jsonwebtoken');
const { factory } = require('factory-girl');
const app = require('../../../app');
const UserModel = require('../../../app/models').user;

const verify = jest.spyOn(jwt, 'verify');
factory.define('user', UserModel, {});

describe('POST /weets', () => {
  verify.mockImplementationOnce(() => ({ id: 1, role: 'user', email: 'johndoe@wolox.com.ar' }));

  beforeEach(() => {
    factory.create('user', {
      id: 1,
      firstName: 'Sherman',
      lastName: 'Cutraro',
      password: 'Sherman33',
      email: 'johndoe@wolox.com.ar',
      role: 'user'
    });
  });

  it('Should return a non authorized error', async () => {
    await request(app)
      .post('/weets')
      .expect(401);
  });

  it('Should create a weet', async () => {
    const { statusCode, body } = await request(app)
      .post('/weets')
      .set('Authorization', 'Bearer abc');

    expect(statusCode).toEqual(201);
    expect(body.id).toBeDefined();
    expect(body.content).toBeDefined();
    expect(body.user).toBe(1);
  });
});
