const request = require('supertest');
const { factory } = require('factory-girl');
const app = require('../../../app');
const UserModel = require('../../../app/models').user;

factory.define('user', UserModel, {
  firstName: 'Sherman',
  lastName: 'Cutraro',
  password: 'Sherman33',
  role: 'admin'
});

jest.mock('../../../app/middlewares/checkJwt.js', () => (req, res, next) => {
  if (!req.headers.authorization) return res.sendStatus(401);
  req.user = { id: 1, role: 'admin', email: 'johndoe@wolox.com.ar' };
  return next();
});

describe('GET /users', () => {
  beforeEach(async done => {
    await factory.createMany('user', 2, [
      {
        id: 1,
        email: 'johndoe@wolox.com.ar'
      },
      {
        id: 2,
        email: 'nick@wolox.com.ar'
      }
    ]);

    done();
  });

  it('Should return a non authorized error', async done => {
    await request(app)
      .get('/users')
      .expect(401);
    done();
  });

  it('Should return a list of users', async done => {
    const { statusCode, body } = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer abc');

    expect(statusCode).toEqual(200);
    expect(body.users).toBeDefined();
    expect(body.users).toHaveLength(2);
    expect(body.users[0].points).toBeDefined();
    expect(body.users[0].points).toBe('DEVELOPER');
    expect(body.pagination).toBeDefined();
    done();
  });

  it('Should return the first page with a limit of one', async done => {
    const { statusCode, body } = await request(app)
      .get('/users?limit=1')
      .set('Authorization', 'Bearer abc');

    expect(statusCode).toEqual(200);
    expect(body.users).toBeDefined();
    expect(body.users).toHaveLength(1);
    expect(body.pagination.count).toBe(1);
    expect(body.pagination.limit).toBe(1);
    expect(body.pagination.current_page).toBe(1);
    done();
  });

  it('Should return the second page with a limit of one', async done => {
    const { statusCode, body } = await request(app)
      .get('/users?limit=1&page=2')
      .set('Authorization', 'Bearer abc');

    expect(statusCode).toEqual(200);
    expect(body.users).toBeDefined();
    expect(body.users).toHaveLength(1);
    expect(body.pagination.count).toBe(1);
    expect(body.pagination.limit).toBe(1);
    expect(body.pagination.current_page).toBe(2);
    done();
  });

  it('Should return all users with a limit of two and without a page', async done => {
    const { statusCode, body } = await request(app)
      .get('/users?limit=2')
      .set('Authorization', 'Bearer abc');

    expect(statusCode).toEqual(200);
    expect(body.users).toBeDefined();
    expect(body.users).toHaveLength(2);
    expect(body.pagination.count).toBe(2);
    expect(body.pagination.limit).toBe(2);
    done();
  });

  it('Should return zero results on page 3', async done => {
    const { statusCode, body } = await request(app)
      .get('/users?limit=1&page=3')
      .set('Authorization', 'Bearer abc');

    expect(statusCode).toEqual(200);
    expect(body.users).toBeDefined();
    expect(body.users).toHaveLength(0);
    expect(body.pagination.count).toBe(0);
    expect(body.pagination.limit).toBe(1);
    expect(body.pagination.current_page).toBe(3);
    done();
  });
});
