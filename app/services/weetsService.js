const request = require('../utils/request');

const weetsService = {
  getRandomNumber() {
    // generate a random number between 0 and 9999 (supported by numbers api)
    return Math.floor(Math.random() * (9999 - 0 + 1) + 0);
  },

  async getOneRandomPhrase() {
    try {
      const { data } = await request(`/${this.getRandomNumber()}/math`);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
};

module.exports = weetsService;
