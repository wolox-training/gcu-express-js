const request = require('supertest');
const app = require('../../../app');
const UserModel = require('../../../app/models').user;
const { updateUser } = require('../../../app/services/userService');

describe('POST /admin/users', () => {
  let jwtToken = null;

  beforeEach(async done => {
    const { body } = await request(app)
      .post('/users/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@wolox.com.ar',
        password: 'Sherman33'
      });
    await updateUser(body.user.id, { role: 'admin' });

    await request(app)
      .post('/users/signup')
      .send({
        firstName: 'Normal',
        lastName: 'User',
        email: 'normal@wolox.com.ar',
        password: 'Sherman33'
      });

    const loginAdminRequest = await request(app)
      .post('/users/sessions')
      .send({
        email: 'johndoe@wolox.com.ar',
        password: 'Sherman33'
      });
    jwtToken = loginAdminRequest.body.token;
    done();
  });

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
      .set('Authorization', `Bearer ${jwtToken}`);

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

  it('Should return a not admin role authorization', async () => {
    const { body } = await request(app)
      .post('/users/sessions')
      .send({
        email: 'normal@wolox.com.ar',
        password: 'Sherman33'
      });

    const userToken = body.user.token;

    const { statusCode } = await request(app)
      .post('/admin/users')
      .send({
        firstName: 'Normal',
        lastName: 'User',
        email: 'normal@wolox.com.ar',
        password: 'Sherman33'
      })
      .set('Authorization', `Bearer ${userToken}`);

    expect(statusCode).toBe(401);
  });

  it('Should change the user role to admin role', async () => {
    const { statusCode, body } = await request(app)
      .post('/admin/users')
      .send({
        firstName: 'Normal',
        lastName: 'User',
        email: 'normal@wolox.com.ar',
        password: 'Sherman33'
      })
      .set('Authorization', `Bearer ${jwtToken}`);

    const users = await UserModel.count();
    expect(statusCode).toBe(200);
    expect(body.user.role).toBe('admin');
    expect(users).toBe(2);
  });

  it('Should return a validation error with an empty required param', async () => {
    const response = await request(app)
      .post('/admin/users')
      .send({
        firstName: 'Germán',
        lastName: 'Cutraro',
        password: 'Sherman33'
      })
      .set('Authorization', `Bearer ${jwtToken}`);

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
      });

    const createdUser = await UserModel.findOne({
      where: {
        email: 'german.cutraro@wolox.com.ar'
      }
    });

    expect(response.body).toHaveProperty('internal_code', 'validation_error');
    expect(response.body).toHaveProperty('message', 'La contraseña debe tener como minimo 8 caracteres');
    expect(createdUser).toBe(null);
  });
});
