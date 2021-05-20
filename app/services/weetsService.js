const request = require('../utils/request');

const weetsService = {
  getRandomNumber: () => Math.floor(Math.random() * (9999 - 0 + 1) + 0),

  getOneRandomPhrase: async () => {
    const { data } = await request(`/${this.getRandomNumber()}/math`);
    return data;
  }
};

module.exports = {
  getOneRandomPhrase: weetsService.getOneRandomPhrase
};
