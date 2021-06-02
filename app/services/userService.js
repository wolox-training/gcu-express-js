const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models').user;
const logger = require('../logger');
const formatEmail = require('../utils/formatEmail');
const paginate = require('../utils/paginate');
const isBetweenTwoNumbers = require('../utils/isBetweenTwoNumbers');
const userPositions = require('../constants/userPositions');

const generateToken = user =>
  jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30m' });

exports.comparePassword = async (password, dbPassword) => {
  const match = await bcrypt.compare(password, dbPassword);
  return match;
};

exports.findUserByEmail = email => UserModel.findOne({ where: { email: formatEmail(email) } });

exports.getUserPosition = userPoints => {
  if (userPoints < 0) return 'DEVELOPER';
  else if (userPoints >= userPositions.CEO) return 'CEO';

  return Object.entries(userPositions).find(position => {
    /**
     * position[0] = the obj key, for example: DEVELOPER
     * position[1][0] = The first number of the array.
     * position[1][1] = The second number of the array.
     */
    if (isBetweenTwoNumbers(userPoints, position[1][0], position[1][1])) return position[0];
    return false;
  })[0];
};

exports.getAllUsers = async query => {
  const { results, pagination } = await paginate(UserModel, {}, query);

  return { results, pagination };
};

exports.encryptPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

exports.createUser = async ({ firstName, lastName, email, role, password }) => {
  const hash = await this.encryptPassword(password);

  const user = await UserModel.create({
    firstName,
    lastName,
    email: formatEmail(email),
    password: hash,
    role
  });

  const token = generateToken(user);

  logger.info(`Usuario creado: ${user.firstName} ${user.lastName}`);
  return { user, token };
};

exports.login = user => {
  const token = generateToken(user);

  logger.info(`Usuario logueado: ${user.firstName} ${user.lastName}`);
  return { user, token };
};

exports.updateUser = async (userId, body) => {
  const userUpdated = await UserModel.update(body, { where: { id: userId }, returning: true });
  return userUpdated[1][0].get();
};
