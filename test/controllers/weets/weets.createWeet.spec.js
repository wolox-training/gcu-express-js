const request = require('supertest');
const app = require('../../../app');
// const WeetModel = require('../../../app/models').weet;

describe('POST /weets', () => {
  let jwtToken = null;

  beforeEach(async done => {
    await request(app)
      .post('/users/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@wolox.com.ar',
        password: 'Sherman33'
      });
    const loginRequest = await request(app)
      .post('/users/sessions')
      .send({
        email: 'johndoe@wolox.com.ar',
        password: 'Sherman33'
      });
    jwtToken = loginRequest.body.token;
    done();
  });

  it('Should return a non authorized error', async () => {
    await request(app)
      .post('/weets')
      .expect(401);
  });

  it('Should create a weet', async () => {
    const { statusCode, body } = await request(app)
      .post('/weets')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(statusCode).toEqual(201);
    expect(body.id).toBeDefined();
    expect(body.content).toBeDefined();
    expect(body.user).toBe(1);
  });
});
