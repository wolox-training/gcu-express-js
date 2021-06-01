const request = require('supertest');
const app = require('../../../app');

describe('GET /weets', () => {
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
    await request(app)
      .post('/weets')
      .set('Authorization', `Bearer ${jwtToken}`);
    await request(app)
      .post('/weets')
      .set('Authorization', `Bearer ${jwtToken}`);

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
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(statusCode).toEqual(200);
    expect(body.weets).toBeDefined();
    expect(body.weets).toHaveLength(2);
    expect(body.pagination).toBeDefined();
  });

  it('Should return the first page with a limit of one', async () => {
    const { statusCode, body } = await request(app)
      .get('/weets?limit=1')
      .set('Authorization', `Bearer ${jwtToken}`);

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
      .set('Authorization', `Bearer ${jwtToken}`);

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
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(statusCode).toEqual(200);
    expect(body.weets).toBeDefined();
    expect(body.weets).toHaveLength(2);
    expect(body.pagination.count).toBe(2);
    expect(body.pagination.limit).toBe(2);
  });

  it('Should return zero results on page 3', async () => {
    const { statusCode, body } = await request(app)
      .get('/weets?limit=1&page=3')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(statusCode).toEqual(200);
    expect(body.weets).toBeDefined();
    expect(body.weets).toHaveLength(0);
    expect(body.pagination.count).toBe(0);
    expect(body.pagination.limit).toBe(1);
    expect(body.pagination.current_page).toBe(3);
  });
});
