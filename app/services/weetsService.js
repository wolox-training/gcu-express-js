const request = require('../utils/request');
const WeetModel = require('../models').weet;
const logger = require('../logger');

const getRandomNumber = () => Math.floor(Math.random() * (9999 - 0 + 1));

exports.getOneRandomPhrase = async () => {
  const { data } = await request(`/${getRandomNumber()}/math`);
  // If the server api fails we truncate the phrase and call a new one using recursion
  if (data.length > 140) {
    logger.info('Generating another phrase. The last was to long.');
    await this.getOneRandomPhrase();
  }
  return data;
};

exports.create = async body => {
  const weet = await WeetModel.create(body);

  return weet;
};
