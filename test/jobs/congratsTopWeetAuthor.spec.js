const jwt = require('jsonwebtoken');
const { factory } = require('factory-girl');
const UserModel = require('../../app/models').user;
const WeetModel = require('../../app/models').weet;
const sendEmail = require('../../app/utils/sendEmail');
const { sendCongratulationEmail } = require('../../app/jobs/congratsTopWeetAuthor');
const templates = require('../../app/constants/templates');

const verify = jest.spyOn(jwt, 'verify');
jest.mock('../../app/utils/sendEmail');

factory.define('user', UserModel, {
  firstName: 'Sherman',
  lastName: 'Cutraro',
  password: 'Sherman33',
  role: 'admin'
});
factory.define('weet', WeetModel, { userId: factory.assoc('user', 'id') });

describe('Job - sendCongratulationEmail', () => {
  beforeEach(async done => {
    verify.mockImplementationOnce(() => ({ id: 1, role: 'admin', email: 'johndoe@wolox.com.ar' }));
    sendEmail.mockImplementationOnce(() => null);

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

    await factory.createMany('weet', 2, [
      { id: 1, content: 'Short weet', userId: usersCreated[0].id },
      {
        id: 2,
        content: 'This is the longest weet',
        userId: usersCreated[1].id
      }
    ]);
    done();
  });

  afterEach(done => {
    factory.cleanUp();
    jest.resetAllMocks();
    done();
  });

  it('Should send a congratulations email to the author of the longest weet', async () => {
    await sendCongratulationEmail();

    expect(sendEmail.mock.calls.length).toBe(1);
    expect(sendEmail.mock.calls[0][0]).toBe('nick@wolox.com.ar');
    expect(sendEmail.mock.calls[0][1]).toBe(templates.congratulationsEmail.subject);
    expect(sendEmail.mock.calls[0][2]).toBe(templates.congratulationsEmail.text(sendEmail.mock.calls[0][0]));
  });
});
