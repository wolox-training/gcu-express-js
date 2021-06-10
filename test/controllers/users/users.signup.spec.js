const request = require('supertest');
const app = require('../../../app');
const UserModel = require('../../../app/models').user;
const sendEmail = require('../../../app/utils/sendEmail');
const templates = require('../../../app/constants/templates');

jest.mock('../../../app/utils/sendEmail');

describe('POST /users/signup', () => {
  beforeEach(done => {
    sendEmail.mockImplementationOnce(() => null);
    done();
  });

  it('Should create a user', async () => {
    const { statusCode, body } = await request(app)
      .post('/users/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'jdoe@wolox.com.ar',
        password: 'Sherman33'
      });

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

  it('Should create a user and send the welcome email', async () => {
    const { statusCode } = await request(app)
      .post('/users/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'jdoe@wolox.com.ar',
        password: 'Sherman33'
      });

    const createdUser = await UserModel.findOne({
      where: {
        email: 'jdoe@wolox.com.ar'
      }
    });

    expect(statusCode).toEqual(201);
    expect(sendEmail.mock.calls.length).toBe(1);
    expect(sendEmail.mock.calls[0][0]).toBe(createdUser.email);
    expect(sendEmail.mock.calls[0][1]).toBe(templates.welcomeEmail.subject);
    expect(sendEmail.mock.calls[0][2]).toBe(templates.welcomeEmail.text(createdUser.email));
  });

  it('Should return a invalid validation email error', async () => {
    const response = await request(app)
      .post('/users/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'jdoe@gmail.com',
        password: '12345678'
      });

    const createdUser = await UserModel.findOne({
      where: {
        email: 'jdoe@gmail.com'
      }
    });

    expect(response.body).toHaveProperty('internal_code', 'validation_error');
    expect(response.body).toHaveProperty('message', 'Email no válido');
    expect(createdUser).toBe(null);
  });

  it('Should return a weak password validation error', async () => {
    const response = await request(app)
      .post('/users/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'jdoe@wolox.com.ar',
        password: 'bad'
      });

    const createdUser = await UserModel.findOne({
      where: {
        email: 'jdoe@wolox.com.ar'
      }
    });

    expect(response.body).toHaveProperty('internal_code', 'validation_error');
    expect(response.body).toHaveProperty('message', 'La contraseña debe tener como minimo 8 caracteres');

    expect(createdUser).toBe(null);
  });

  it('Should return a validation error with an empty required param', async () => {
    const response = await request(app)
      .post('/users/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        password: 'Sherman33'
      });

    const createdUser = await UserModel.findOne({
      where: {
        firstName: 'John',
        lastName: 'Doe'
      }
    });

    expect(response.body).toHaveProperty('internal_code', 'validation_error');
    expect(response.body).toHaveProperty('message', 'Email requerido');
    expect(createdUser).toBe(null);
  });

  it('Should return an existing email error', async () => {
    UserModel.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe@wolox.com.ar',
      password: 'Sherman33'
    });

    const response = await request(app)
      .post('/users/signup')
      .send({
        firstName: 'Nick',
        lastName: 'Robinson',
        email: 'jdoe@wolox.com.ar',
        password: 'Sherman33'
      });

    const createdUser = await UserModel.findOne({
      where: {
        email: 'jdoe@wolox.com.ar'
      }
    });

    expect(response.body).toHaveProperty('internal_code', 'database_error');
    expect(response.body).toHaveProperty('message', 'Usuario existente');
    expect(createdUser.firstName).toBe('John');
    expect(createdUser.lastName).toBe('Doe');
  });
});
