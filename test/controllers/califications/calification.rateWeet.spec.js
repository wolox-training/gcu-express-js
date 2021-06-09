const request = require('supertest');
const jwt = require('jsonwebtoken');
const { factory } = require('factory-girl');
const UserModel = require('../../../app/models').user;
const WeetModel = require('../../../app/models').weet;
const CalificationModel = require('../../../app/models').calification;
const app = require('../../../app');

const verify = jest.spyOn(jwt, 'verify');
factory.define('user', UserModel, {
  firstName: 'Sherman',
  lastName: 'Cutraro',
  password: 'Sherman33',
  role: 'admin'
});
factory.define('weet', WeetModel, { id: 1, content: 'Lorem Ipsum', userId: factory.assoc('user', 'id') });

describe('POST /weets/:id/ratings', () => {
  beforeEach(async done => {
    verify.mockImplementationOnce(() => ({ id: 1, role: 'admin', email: 'johndoe@wolox.com.ar' }));
    const usersCreated = await factory.createMany('user', 2, [
      {
        id: 1,
        email: 'johndoe@wolox.com.ar'
      },
      {
        id: 2,
        email: 'nick@wolox.com.ar'
      }
    ]);

    await factory.create('weet', { userId: usersCreated[0].id });
    done();
  });

  afterEach(done => {
    factory.cleanUp();
    jest.resetAllMocks();
    done();
  });

  it('Should return a non authorized error', async () => {
    await request(app)
      .get('/weets')
      .expect(401);
  });

  it('Should return a score required', async () => {
    const response = await request(app)
      .post('/weets/1/ratings')
      .send({ score: null })
      .set('Authorization', 'Bearer abc');

    expect(response.statusCode).toBe(400);
    expect(response.body.internal_code).toBe('validation_error');
    expect(response.body.message).toBe('Score required');
  });

  it('Should return a score invalid', async () => {
    const response = await request(app)
      .post('/weets/1/ratings')
      .send({ score: 10 })
      .set('Authorization', 'Bearer abc');

    expect(response.statusCode).toBe(400);
    expect(response.body.internal_code).toBe('validation_error');
    expect(response.body.message).toBe('Invalid Score. Must be either 1 or -1');
  });

  it('Should return a weet not found error', async () => {
    const response = await request(app)
      .post('/weets/100/ratings')
      .send({ score: 1 })
      .set('Authorization', 'Bearer abc');

    expect(response.statusCode).toBe(404);
    expect(response.body.internal_code).toBe('not_found_error');
    expect(response.body.message).toBe('Weet not found');
  });

  it('Should creates a calification and update the user points', async () => {
    const response = await request(app)
      .post('/weets/1/ratings')
      .send({ score: 1 })
      .set('Authorization', 'Bearer abc');

    const rating = await CalificationModel.findOne({ where: { weetId: 1, ratingUserId: 1 } });
    const weetAuthor = await UserModel.findByPk(1);

    expect(response.statusCode).toBe(200);
    expect(rating.score).toBe(1);
    expect(rating.weetId).toBe(1);
    expect(rating.ratingUserId).toBe(1);
    expect(weetAuthor.points).toBe(1);
  });

  it('Should have two points with two different users rating', async () => {
    await request(app)
      .post('/weets/1/ratings')
      .send({ score: 1 })
      .set('Authorization', 'Bearer abc');

    verify.mockImplementationOnce(() => ({ id: 2, role: 'admin', email: 'nick@wolox.com.ar' }));
    const response = await request(app)
      .post('/weets/1/ratings')
      .send({ score: 1 })
      .set('Authorization', 'Bearer abc');

    const weetAuthor = await UserModel.findByPk(1);

    expect(response.statusCode).toBe(200);
    expect(weetAuthor.points).toBe(2);
  });

  it('Should have the same points with the same user rating it', async () => {
    await request(app)
      .post('/weets/1/ratings')
      .send({ score: 1 })
      .set('Authorization', 'Bearer abc');

    verify.mockImplementationOnce(() => ({ id: 1, role: 'admin', email: 'johndoe@wolox.com.ar' }));
    const response = await request(app)
      .post('/weets/1/ratings')
      .send({ score: 1 })
      .set('Authorization', 'Bearer abc');

    const weetAuthor = await UserModel.findByPk(1);

    expect(response.statusCode).toBe(200);
    expect(weetAuthor.points).toBe(1);
  });

  it('Should update the user points to zero', async () => {
    await request(app)
      .post('/weets/1/ratings')
      .send({ score: 1 })
      .set('Authorization', 'Bearer abc');

    verify.mockImplementationOnce(() => ({ id: 1, role: 'admin', email: 'johndoe@wolox.com.ar' }));
    const response = await request(app)
      .post('/weets/1/ratings')
      .send({ score: -1 })
      .set('Authorization', 'Bearer abc');

    const rating = await CalificationModel.findOne({ where: { weetId: 1, ratingUserId: 1 } });
    const weetAuthor = await UserModel.findByPk(1);

    expect(response.statusCode).toBe(200);
    expect(rating.score).toBe(-1);
    expect(rating.weetId).toBe(1);
    expect(rating.ratingUserId).toBe(1);
    expect(weetAuthor.points).toBe(0);
  });
});
