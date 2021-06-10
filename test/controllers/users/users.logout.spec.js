const request = require('supertest');
const { factory } = require('factory-girl');
const app = require('../../../app');
const UserModel = require('../../../app/models').user;
const SessionModel = require('../../../app/models').session;
const { generateToken } = require('../../../app/services/userService');

factory.define('user', UserModel, {});

describe('POST /users/signup', () => {
  let token = null;

  beforeEach(async () => {
    const userCreated = await factory.create('user', {
      id: 1,
      firstName: 'Sherman',
      lastName: 'Cutraro',
      email: 'jdoe@wolox.com.ar',
      password: 'Sherman33',
      role: 'admin'
    });

    token = generateToken(userCreated);
  });

  afterEach(done => {
    factory.cleanUp();
    jest.resetAllMocks();
    done();
  });

  it('Should return a non authorized error', async () => {
    await request(app)
      .post('/users/sessions/invalidate_all')
      .expect(401);
  });

  it('Should sign out and create a new invalid session', async () => {
    const response = await request(app)
      .post('/users/sessions/invalidate_all')
      .set('Authorization', `Bearer ${token}`);

    const session = await SessionModel.findOne({ where: { userId: 1 } });

    expect(response.statusCode).toBe(200);
    expect(session.userId).toBe(1);
    expect(session.logoutTime).toBeDefined();
  });

  it('Should return a 401 error with a expired session token', async () => {
    await request(app)
      .post('/users/sessions/invalidate_all')
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(401);
  });
});
