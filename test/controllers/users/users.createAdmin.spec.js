const request = require('supertest');
const { factory } = require('factory-girl');
const app = require('../../../app');
const UserModel = require('../../../app/models').user;
const userInteractor = require('../../../app/interactors/userInteractor');

jest.mock('../../../app/middlewares/checkJwt.js', () => (req, res, next) => {
  if (!req.headers.authorization) return res.sendStatus(401);
  req.user = { id: 1, role: 'admin', email: 'johndoe@wolox.com.ar' };
  return next();
});
const login = jest.spyOn(userInteractor, 'auth0');

factory.define('user', UserModel, {});

describe('POST /admin/users', () => {
  beforeEach(async done => {
    await factory.create('user', {
      id: 1,
      firstName: 'Sherman',
      lastName: 'Cutraro',
      password: 'Sherman33',
      email: 'johndoe@wolox.com.ar',
      role: 'admin'
    });
    done();
  });

  afterEach(done => {
    factory.cleanUp();
    jest.resetAllMocks();
    done();
  });

  it('Should throw a non authorized error', async done => {
    await request(app)
      .post('/admin/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'jdoe@wolox.com.ar',
        password: 'Sherman33'
      })
      .expect(401);
    done();
  });

  it('Should create a user admin', async done => {
    const { statusCode, body } = await request(app)
      .post('/admin/users')
      .send({
        id: 10,
        firstName: 'John',
        lastName: 'Doe',
        email: 'jdoe@wolox.com.ar',
        password: 'Sherman33'
      })
      .set('Authorization', 'Bearer abc');

    const createdUser = await UserModel.findOne({
      where: {
        email: 'jdoe@wolox.com.ar'
      }
    });

    expect(statusCode).toEqual(201);
    expect(body.token).toBeDefined();
    expect(body.user).toBeDefined();
    expect(createdUser.firstName).toEqual('John');
    expect(createdUser.lastName).toEqual('Doe');
    expect(createdUser.email).toEqual('jdoe@wolox.com.ar');
    done();
  });

  it('Should return a not admin role authorization', async done => {
    login.mockImplementationOnce(() => ({ id: 1, role: 'admin', email: 'johndoe@wolox.com.ar' }));

    const { statusCode } = await request(app)
      .post('/admin/users')
      .send({
        firstName: 'Normal',
        lastName: 'User',
        email: 'normal@wolox.com.ar',
        password: 'Sherman33'
      })
      .set('Authorization', 'Bearer abc');

    expect(statusCode).toBe(401);
    done();
  });

  it('Should change the user role to admin role', async done => {
    const { statusCode, body } = await request(app)
      .post('/admin/users')
      .send({
        firstName: 'Normal',
        lastName: 'User',
        email: 'norm@wolox.com.ar',
        password: 'Sherman33'
      })
      .set('Authorization', 'Bearer abc');

    const users = await UserModel.count();
    expect(statusCode).toBe(200);
    expect(body.user.role).toBe('admin');
    expect(users).toBe(2);
    done();
  });

  it('Should return a validation error with an empty required param', async done => {
    const response = await request(app)
      .post('/admin/users')
      .send({
        firstName: 'Germán',
        lastName: 'Cutraro',
        password: 'Sherman33'
      })
      .set('Authorization', 'Bearer abc');

    const createdUser = await UserModel.findOne({
      where: {
        firstName: 'Germán',
        lastName: 'Cutraro'
      }
    });

    expect(response.body).toHaveProperty('internal_code', 'validation_error');
    expect(response.body).toHaveProperty('message', 'Email requerido');
    expect(createdUser).toBe(null);
    done();
  });

  it('Should return a weak password validation error', async done => {
    const response = await request(app)
      .post('/admin/users')
      .send({
        firstName: 'Germán',
        lastName: 'Cutraro',
        email: 'german.cutraro@wolox.com.ar',
        password: 'bad'
      });

    const createdUser = await UserModel.findOne({
      where: {
        email: 'german.cutraro@wolox.com.ar'
      }
    });

    expect(response.body).toHaveProperty('internal_code', 'validation_error');
    expect(response.body).toHaveProperty('message', 'La contraseña debe tener como minimo 8 caracteres');
    expect(createdUser).toBe(null);
    done();
  });
});
