const {
  findUserByEmail,
  createUser,
  login,
  comparePassword,
  getAllUsers,
  updateUser
} = require('../services/userService');
const logger = require('../logger');
const { databaseError, authenticationError } = require('../errors');
const errorMessages = require('../constants/errorMessages');

exports.getUsers = query => getAllUsers(query);

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

exports.createUserAdmin = async body => {
  const userExists = await findUserByEmail(body.email);

  if (userExists) {
    logger.info(`Se ha actualizado al usuario ${userExists.name} como administrador`);
    const userUpdatedToAdmin = await updateUser(userExists.id, { role: 'admin' });
    return { user: userUpdatedToAdmin };
  }

  return createUser({ ...body, role: 'admin' });
};
