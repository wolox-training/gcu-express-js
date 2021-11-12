const request = require('supertest');
const { factory } = require('factory-girl');
const app = require('../../../app');
const UserModel = require('../../../app/models').user;
const SessionModel = require('../../../app/models').session;

jest.mock('../../../app/middlewares/checkJwt.js', () => (req, res, next) => {
  if (!req.headers.authorization) return res.sendStatus(401);
  req.user = { id: 1, role: 'admin', email: 'johndoe@wolox.com.ar' };
  return next();
});

factory.define('user', UserModel, {});

describe('POST /users/logout', () => {
  beforeEach(async () => {
    await factory.create('user', {
      id: 1,
      firstName: 'Sherman',
      lastName: 'Cutraro',
      email: 'jdoe@wolox.com.ar',
      password: 'Sherman33',
      role: 'admin'
    });
  });

  afterEach(done => {
    factory.cleanUp();
    jest.resetAllMocks();
    done();
  });

  it('Should return a non authorized error', async done => {
    await request(app)
      .post('/users/sessions/invalidate_all')
      .expect(401);
    done();
  });

  it('Should sign out and create a new invalid session', async done => {
    const response = await request(app)
      .post('/users/sessions/invalidate_all')
      .set('Authorization', 'Bearer abc');

    const session = await SessionModel.findOne({ where: { userId: 1 } });

    expect(response.statusCode).toBe(200);
    expect(session.userId).toBe(1);
    expect(session.logoutTime).toBeDefined();
    done();
  });

  it('Should return a 401 error with a expired session token', async done => {
    await request(app)
      .post('/users/sessions/invalidate_all')
      .set('Authorization', 'Bearer abc');

    const response = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer abc');

    expect(response.statusCode).toBe(401);
    done();
  });
});
