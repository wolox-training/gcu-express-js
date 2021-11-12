const request = require('supertest');
const app = require('../../../app');
const UserModel = require('../../../app/models').user;
const { encryptPassword } = require('../../../app/services/userService');

describe('POST /users/signup', () => {
  it('Should sign in', async () => {
    await UserModel.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe@wolox.com.ar',
      password: await encryptPassword('Sherman33')
    });

    const { statusCode, body } = await request(app)
      .post('/users/sessions')
      .send({
        email: 'jdoe@wolox.com.ar',
        password: 'Sherman33'
      });

    expect(statusCode).toEqual(200);
    expect(body.token).toBeDefined();
    expect(body.user).toBeDefined();
  });

  it('Should return a validation email error', async () => {
    await UserModel.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe@wolox.com.ar',
      password: await encryptPassword('Sherman33')
    });

    const { body } = await request(app)
      .post('/users/sessions')
      .send({
        email: null,
        password: 'Sherman33'
      });

    expect(body).toHaveProperty('internal_code', 'validation_error');
    expect(body).toHaveProperty('message', 'Email requerido');
  });

  it('Should return a validation password error', async () => {
    await UserModel.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe@wolox.com.ar',
      password: await encryptPassword('Sherman33')
    });

    const { body } = await request(app)
      .post('/users/sessions')
      .send({
        email: 'jdoe@wolox.com.ar',
        password: null
      });

    expect(body).toHaveProperty('internal_code', 'validation_error');
    expect(body).toHaveProperty('message', 'Contraseña requerida');
  });

  it('Should return a user not found error', async () => {
    await UserModel.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe@wolox.com.ar',
      password: await encryptPassword('Sherman33')
    });

    const { body } = await request(app)
      .post('/users/sessions')
      .send({
        email: 'nonexist@wolox.com.ar',
        password: 'Sherman33'
      });

    expect(body).toHaveProperty('internal_code', 'database_error');
    expect(body).toHaveProperty('message', 'No se encontró al usuario');
  });

  it('Should return a credentials error', async () => {
    await UserModel.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe@wolox.com.ar',
      password: await encryptPassword('Sherman33')
    });

    const { body } = await request(app)
      .post('/users/sessions')
      .send({
        email: 'jdoe@wolox.com.ar',
        password: 'BadPassword'
      });

    expect(body).toHaveProperty('internal_code', 'authentication_error');
    expect(body).toHaveProperty('message', 'Credenciales incorrectas');
  });
});
