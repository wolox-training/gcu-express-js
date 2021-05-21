const asyncWrapper = require('../utils/asyncWrapper');
const { getOneRandomPhrase } = require('../services/weetsService');

// this was created for test purposes, will be removed
exports.getWeet = asyncWrapper(async (req, res) => {
  const phrase = await getOneRandomPhrase();
  return res.status(200).json(phrase);
});
