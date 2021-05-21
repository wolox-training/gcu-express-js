const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models').user;
const logger = require('../logger');
const filterEmail = require('../utils/filterEmail');

/**
 *
 * @param {string} password password
 * @returns {Promise} hashed password
 */
const encryptPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

/**
 *
 * @param {number} userId id
 * @returns {string} JWT token
 */
const generateToken = userId => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30m' });

/**
 *
 * @param {string} email email
 * @returns {Promise} User object
 */
exports.findUserByEmail = email => UserModel.findOne({ where: { email: filterEmail(email) } });

/**
 *
 * @param {string} name name
 * @param {string} lastName last_name
 * @param {string} email email
 * @param {string} password password
 * @returns {object} User object
 */
exports.createUser = async ({ name, lastName, email, password }) => {
  const hash = await encryptPassword(password);

  const user = await UserModel.create({
    name,
    lastName,
    email: filterEmail(email),
    password: hash
  });

  const token = await generateToken(user.id);

  logger.info(`Usuario creado: ${user.name} ${user.last_name}`);
  return { user, token };
};
