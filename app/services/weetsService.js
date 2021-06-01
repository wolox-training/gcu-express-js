const request = require('../utils/request');
const WeetModel = require('../models').weet;
const paginate = require('../utils/paginate');

const getRandomNumber = () => Math.floor(Math.random() * (9999 - 0 + 1));

exports.getOneRandomPhrase = async () => {
  const { data } = await request(`/${getRandomNumber()}/math`);
  return data;
};

exports.getAllWeets = async query => {
  const { results, pagination } = await paginate(WeetModel, {}, query);
  return { results, pagination };
};

exports.create = async body => {
  const weet = await WeetModel.create(body);

  return weet;
};
