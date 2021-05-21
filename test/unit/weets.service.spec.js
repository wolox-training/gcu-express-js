const { getOneRandomPhrase } = require('../../app/services/weetsService');

describe('Weets Service', () => {
  // it('Should be an object', () => {
  //   expect(typeof weetService).toBe('object');
  // });

  // it('Should generate a random number between 0 and 9999', () => {
  //   const number = weetService.getRandomNumber();

  //   expect(number).toBeGreaterThanOrEqual(0);
  //   expect(number).toBeLessThanOrEqual(9999);
  // });

  it('Should generate a random number between 0 and 9999', async () => {
    const phrase = await getOneRandomPhrase();

    expect(phrase).toBeDefined();
    expect(typeof phrase).toBe('string');
  });
});
