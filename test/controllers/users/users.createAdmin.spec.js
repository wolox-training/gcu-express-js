const request = require('supertest');
// const { factory } = require('factory-girl');
const jwt = require('jsonwebtoken');
const app = require('../../../app');
const UserModel = require('../../../app/models').user;
const { factoryByModel } = require('../../factory/factory_by_models');

const verify = jest.spyOn(jwt, 'verify');

describe('POST /admin/users', () => {
  factoryByModel('user');
  verify.mockImplementationOnce(() => ({ id: 1, role: 'admin' }));

  it('Should throw a non authorized error', async () => {
    await request(app)
      .post('/admin/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'jdoe@wolox.com.ar',
        password: 'Sherman33'
      })
      .expect(401);
  });

  it('Should create a user admin', async () => {
    const { statusCode, body } = await request(app)
      .post('/admin/users')
      .send({
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
  });

  it('Should change the user role to admin role', async () => {
    verify.mockImplementationOnce(() => ({ id: 1, role: 'admin' }));
    const { statusCode, body } = await request(app)
      .post('/admin/users')
      .send({
        firstName: 'Normal',
        lastName: 'User',
        email: 'normal@wolox.com.ar',
        password: 'Sherman33'
      })
      .set('Authorization', 'Bearer abc');

    const users = await UserModel.count();
    expect(statusCode).toBe(201);
    expect(body.user.role).toBe('admin');
    expect(users).toBe(1);
  });

  it('Should return a validation error with an empty required param', async () => {
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
  });

  it('Should return a weak password validation error', async () => {
    const response = await request(app)
      .post('/admin/users')
      .send({
        firstName: 'Germán',
        lastName: 'Cutraro',
        email: 'german.cutraro@wolox.com.ar',
        password: 'bad'
      })
      .set('Authorization', 'Bearer abc');

    const createdUser = await UserModel.findOne({
      where: {
        email: 'german.cutraro@wolox.com.ar'
      }
    });

    expect(response.body).toHaveProperty('internal_code', 'validation_error');
    expect(response.body).toHaveProperty('message', 'La contraseña debe tener como minimo 8 caracteres');
    expect(createdUser).toBe(null);
  });

  it('Should return a not admin role authorization', async () => {
    verify.mockImplementationOnce(() => ({ id: 1, role: 'user' }));

    const { statusCode } = await request(app)
      .post('/admin/users')
      .send({
        firstName: 'Normal',
        lastName: 'User',
        email: 'normal@wolox.com.ar',
        password: 'Sherman33'
      })
      .set('Authorization', 'Bearer abc');

    expect(statusCode).toBe(403);
  });
});
