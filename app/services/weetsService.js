const request = require('../utils/request');

const getRandomNumber = () => Math.floor(Math.random() * (9999 - 0 + 1));

exports.getOneRandomPhrase = async () => {
  const { data } = await request(`/${getRandomNumber()}/math`);
  return data;
};
