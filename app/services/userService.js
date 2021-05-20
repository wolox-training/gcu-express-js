const UserModel = require('../models').user;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../logger');
const filterEmail = require('../utils/filterEmail');

/**
 *
 * @param {string} password
 * @returns {Promise} hashed password
 */
const encryptPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 *
 * @param {number} userId
 * @returns {string} JWT token
 */
const generateToken = async userId => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30m'
  });
};

/**
 *
 * @param {string} email
 * @returns {Promise} User object
 */
exports.findUserByEmail = email => {
  return UserModel.findOne({
    where: {
      email: filterEmail(email)
    }
  });
};

/**
 *
 * @param {string} name
 * @param {string} last_name
 * @param {string} email
 * @param {string} password
 * @returns {object} User object
 */
exports.createUser = async ({ name, last_name, email, password }) => {
  const hash = await encryptPassword(password);

  const user = await UserModel.create({
    name,
    last_name,
    email: filterEmail(email),
    password: hash
  });

  const token = await generateToken(user.id);

  logger.info(`Usuario creado: ${user.name} ${user.last_name}`);
  return { user, token };
};
