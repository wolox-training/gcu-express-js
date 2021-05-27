const { findUserByEmail, createUser } = require('../services/userService');
const logger = require('../logger');
const { databaseError } = require('../errors');
const errorMessages = require('../constants/errorMessages');

exports.signUp = async body => {
  const userExists = await findUserByEmail(body.email);

  if (userExists) {
    logger.error(errorMessages.userAlreadyExist);
    throw databaseError(errorMessages.userAlreadyExist);
  }

  return createUser(body);
};
