const request = require('supertest');
const jwt = require('jsonwebtoken');
const { factory } = require('factory-girl');
const UserModel = require('../../../app/models').user;
const WeetModel = require('../../../app/models').weet;
const app = require('../../../app');

const verify = jest.spyOn(jwt, 'verify');
factory.define('user', UserModel, {});
factory.define('weet', WeetModel, { content: 'Lorem Ipsum', userId: factory.assoc('user', 'id') });

describe('GET /weets', () => {
  beforeEach(async done => {
    verify.mockImplementationOnce(() => ({ id: 1, role: 'admin', email: 'johndoe@wolox.com.ar' }));
    const userCreated = await factory.create('user', {
      id: 1,
      firstName: 'Sherman',
      lastName: 'Cutraro',
      password: 'Sherman33',
      email: 'johndoe@wolox.com.ar',
      role: 'user'
    });
    await factory.createMany('weet', 2, { userId: userCreated.id });
    done();
  });

  afterAll(done => {
    factory.cleanUp();
    done();
  });

  it('Should return a non authorized error', async () => {
    await request(app)
      .get('/weets')
      .expect(401);
  });

  it('Should return a list of weets', async () => {
    const { statusCode, body } = await request(app)
      .get('/weets')
      .set('Authorization', 'Bearer abc');

    expect(statusCode).toEqual(200);
    expect(body.weets).toBeDefined();
    expect(body.weets).toHaveLength(2);
    expect(body.pagination).toBeDefined();
  });

  it('Should return the first page with a limit of one', async () => {
    const { statusCode, body } = await request(app)
      .get('/weets?limit=1')
      .set('Authorization', 'Bearer abc');

    expect(statusCode).toEqual(200);
    expect(body.weets).toBeDefined();
    expect(body.weets).toHaveLength(1);
    expect(body.pagination.count).toBe(1);
    expect(body.pagination.limit).toBe(1);
    expect(body.pagination.current_page).toBe(1);
  });

  it('Should return the second page with a limit of one', async () => {
    const { statusCode, body } = await request(app)
      .get('/weets?limit=1&page=2')
      .set('Authorization', 'Bearer abc');

    expect(statusCode).toEqual(200);
    expect(body.weets).toBeDefined();
    expect(body.weets).toHaveLength(1);
    expect(body.pagination.count).toBe(1);
    expect(body.pagination.limit).toBe(1);
    expect(body.pagination.current_page).toBe(2);
  });

  it('Should return all weets with a limit of two and without a page', async () => {
    const { statusCode, body } = await request(app)
      .get('/weets?limit=2')
      .set('Authorization', 'Bearer abc');

    expect(statusCode).toEqual(200);
    expect(body.weets).toBeDefined();
    expect(body.weets).toHaveLength(2);
    expect(body.pagination.count).toBe(2);
    expect(body.pagination.limit).toBe(2);
  });

  it('Should return zero results on page 3', async () => {
    const { statusCode, body } = await request(app)
      .get('/weets?limit=1&page=3')
      .set('Authorization', 'Bearer abc');

    expect(statusCode).toEqual(200);
    expect(body.weets).toBeDefined();
    expect(body.weets).toHaveLength(0);
    expect(body.pagination.count).toBe(0);
    expect(body.pagination.limit).toBe(1);
    expect(body.pagination.current_page).toBe(3);
  });
});
