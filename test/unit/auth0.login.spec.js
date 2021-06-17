const nock = require('nock');
const { getAuth0Token } = require('../../app/services/userService');

describe('Auth0', () => {
  it('Should return a Auth0 token access', async done => {
    nock(process.env.AUTH0_DOMAIN)
      .post('/oauth/token')
      .reply(200, {
        data: {
          access_token: 'Hk87Jd1MnD5e8b1gQWguUjvIGwnBaxxN',
          id_token:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImhhY1gxOU9QT1hEOVdtMFIyQjZZWiJ9.eyJnaXZlbl9uYW1lIjoiR2VybcOhbiIsImZhbWlseV9uYW1lIjoiQ3V0cmFybyIsIm5pY2tuYW1lIjoiZ2VybWFuLmN1dHJhcm8iLCJuYW1lIjoiR2VybcOhbiBDdXRyYXJvIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdoQVp3U0VpSjlWZklyMzFmQ2VuRXo3cEk0TEdPd1BEcmJxbENwSz1zOTYtYyIsImxvY2FsZSI6ImVuIiwidXBkYXRlZF9hdCI6IjIwMjEtMDYtMTZUMTk6MDY6NDAuODkxWiIsImlzcyI6Imh0dHBzOi8vZ2MtdHJhaW5pbmcudXMuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTE1NDE4MTMxMjI2OTQ4MzQ1OTA5IiwiYXVkIjoiZFVXNUkzR3oycHdzR2xNbE1Dd3J5TWdyOFdkZ2xHb04iLCJpYXQiOjE2MjM4NzA0MTksImV4cCI6MTYyMzkwNjQxOX0.OJHWCmgYjuQW1cRn3qa_lP2m7lIoun5O31Hpw9g46QDUFsqi2eylK0I4U3SQ7ycFHtRz47VmNkBpr93rTHSR-H4UsOX_jqmTmvRggOi93lKt6WtNpmywfGZil69CUf4N05vBP_1rYB1Ms9lEpuJc3Tm-XU9KMAc8riPnJdoUUDIqocgaBYS85Y5UA2IJaya5k1-K8BQPI4IjOomOJQMP7XLk_nBeps8-lACKVpYGWOuAAvgezPA9C1Qnks6CfvRIa7IwXVBXlNmcNRPX6WOnITIJvDSMs1upcR6AQIbrQ2jw4uUAw6siCtXlMBvHDrqsgosFcA3B31fayNCwTJiYNA',
          expires_in: 86400,
          token_type: 'Bearer'
        }
      });

    const res = await getAuth0Token();
    expect(res.data.access_token).toBeDefined();
    expect(res.data.id_token).toBeDefined();
    expect(res.data.token_type).toBe('Bearer');
    done();
  });
});
