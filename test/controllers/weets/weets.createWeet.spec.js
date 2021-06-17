const request = require('supertest');
const { factory } = require('factory-girl');
const app = require('../../../app');
const UserModel = require('../../../app/models').user;

factory.define('user', UserModel, {});

jest.mock('../../../app/middlewares/checkJwt.js', () => (req, res, next) => {
  if (!req.headers.authorization) return res.sendStatus(401);
  req.user = { id: 1, role: 'admin', email: 'johndoe@wolox.com.ar' };
  return next();
});

describe('POST /weets', () => {
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

  it('Should return a non authorized error', async done => {
    await request(app)
      .post('/weets')
      .expect(401);
    done();
  });

  it('Should create a weet', async done => {
    const { statusCode, body } = await request(app)
      .post('/weets')
      .set('Authorization', 'Bearer abc');

    expect(statusCode).toEqual(201);
    expect(body.id).toBeDefined();
    expect(body.content).toBeDefined();
    expect(body.user).toBe(1);
    done();
  });
});
