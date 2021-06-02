const { getUserPosition } = require('../../app/services/userService');

describe('Weets Service', () => {
  it('Should return DEVELOPER', () => {
    expect(getUserPosition(3)).toBe('DEVELOPER');
  });

  it('Should return LEAD', () => {
    expect(getUserPosition(8)).toBe('LEAD');
  });

  it('Should return TECHNICAL_LEADER', () => {
    expect(getUserPosition(12)).toBe('TECHNICAL_LEADER');
  });

  it('Should return ENGINEER_MANAGER', () => {
    expect(getUserPosition(29)).toBe('ENGINEER_MANAGER');
  });

  it('Should return HEAD', () => {
    expect(getUserPosition(33)).toBe('HEAD');
  });

  it('Should return CEO with 50 points', () => {
    expect(getUserPosition(50)).toBe('CEO');
  });

  it('Should return CEO with more than 50 points', () => {
    expect(getUserPosition(100000)).toBe('CEO');
  });

  it('Should return DEVELOPER with a negatove number', () => {
    expect(getUserPosition(-10)).toBe('DEVELOPER');
  });
});
