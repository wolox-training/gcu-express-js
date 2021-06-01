const request = require('../utils/request');
const WeetModel = require('../models').weet;

const getRandomNumber = () => Math.floor(Math.random() * (9999 - 0 + 1));

exports.getOneRandomPhrase = async () => {
  const { data } = await request(`/${getRandomNumber()}/math`);
  return data;
};

exports.create = async body => {
  const weet = await WeetModel.create(body);

  return weet;
};
