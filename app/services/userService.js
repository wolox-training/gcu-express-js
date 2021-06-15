const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../models');
const UserModel = require('../models').user;
const SessionModel = require('../models').session;
const WeetModel = require('../models').weet;
const logger = require('../logger');
const formatEmail = require('../utils/formatEmail');
const paginate = require('../utils/paginate');
const userPositions = require('../constants/userPositions');
const findPointKey = require('../utils/findPointKey');

exports.generateToken = user =>
  jwt.sign({ id: user.id, role: user.role, email: user.email, iat: Date.now() }, process.env.JWT_SECRET, {
    expiresIn: '30m'
  });

exports.comparePassword = async (password, dbPassword) => {
  const match = await bcrypt.compare(password, dbPassword);
  return match;
};

exports.findUserByEmail = email => UserModel.findOne({ where: { email: formatEmail(email) } });

exports.findUserById = id => UserModel.findByPk(id);

exports.findTopWeetAuthor = async () => {
  try {
    const mostWordWeetAuthor = await WeetModel.findAll({
      limit: 1,
      where: {},
      order: [[sequelize.fn('length', sequelize.col('content')), 'DESC']]
    });

    let topUser = null;
    if (mostWordWeetAuthor[0]) topUser = await UserModel.findByPk(mostWordWeetAuthor[0].userId);

    return topUser;
  } catch (err) {
    logger.info(`findTopWeetAuthor ${err.message}`);
    return err;
  }
};

exports.getUserPosition = userPoints => {
  if (userPoints < 0) return 'DEVELOPER';
  else if (userPoints >= userPositions.CEO) return 'CEO';

  return findPointKey(userPositions, userPoints);
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

  const token = this.generateToken(user);

  logger.info(`Usuario creado: ${user.firstName} ${user.lastName}`);
  return { user, token };
};

exports.login = user => {
  const token = this.generateToken(user);

  logger.info(`Usuario logueado: ${user.firstName} ${user.lastName}`);
  return { user, token };
};

exports.updateUser = async (userId, body) => {
  const userUpdated = await UserModel.update(body, { where: { id: userId }, returning: true });
  return userUpdated[1][0].get();
};

exports.destroySession = userId => SessionModel.create({ userId, logoutTime: Date.now() });
