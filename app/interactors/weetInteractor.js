const weetService = require('../services/weetsService');
const userService = require('../services/userService');
const errorMessages = require('../constants/errorMessages');
const { notFoundError } = require('../errors');

exports.createWeet = async body => {
  const user = await userService.findUserByEmail(body.email);
  if (!user) throw notFoundError(errorMessages.userNotFound);

  const content = await weetService.getOneRandomPhrase();

  const weet = await weetService.create({ ...body, content });

  return weet;
};
