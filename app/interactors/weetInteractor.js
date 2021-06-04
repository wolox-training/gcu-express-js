const weetService = require('../services/weetsService');
const userService = require('../services/userService');
const errorMessages = require('../constants/errorMessages');
const { validationError, notFoundError } = require('../errors');
const logger = require('../logger');

exports.createWeet = async body => {
  const user = await userService.findUserByEmail(body.email);
  if (!user) throw notFoundError(errorMessages.userNotFound);

  const content = await weetService.getOneRandomPhrase();
  if (content.length > 140) {
    logger.info('Weet length error');
    throw validationError(errorMessages.invalidWeet);
  }

  const weet = await weetService.create({ ...body, content });

  return weet;
};
