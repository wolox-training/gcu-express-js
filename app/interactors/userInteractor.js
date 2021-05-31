const { findUserByEmail, createUser, login, comparePassword } = require('../services/userService');
const logger = require('../logger');
const { databaseError, authenticationError } = require('../errors');
const errorMessages = require('../constants/errorMessages');

exports.signUp = async body => {
  const userExists = await findUserByEmail(body.email);

  if (userExists) {
    logger.error(errorMessages.userAlreadyExist);
    throw databaseError(errorMessages.userAlreadyExist);
  }

  return createUser(body);
};

exports.signIn = async body => {
  const userExists = await findUserByEmail(body.email);

  if (!userExists) {
    logger.error(errorMessages.userNotFound);
    throw databaseError(errorMessages.userNotFound);
  }
  const isEqual = await comparePassword(body.password, userExists.password);
  if (!isEqual) {
    logger.error(errorMessages.invalidCredentials);
    throw authenticationError(errorMessages.invalidCredentials);
  }

  return login(userExists);
};
