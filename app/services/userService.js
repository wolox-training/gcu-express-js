const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models').user;
const logger = require('../logger');
const formatEmail = require('../utils/formatEmail');

const encryptPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const generateToken = userId => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30m' });

exports.findUserByEmail = email => UserModel.findOne({ where: { email: formatEmail(email) } });

exports.createUser = async ({ firstName, lastName, email, password }) => {
  const hash = await encryptPassword(password);

  const user = await UserModel.create({
    firstName,
    lastName,
    email: formatEmail(email),
    password: hash
  });

  const token = await generateToken(user.id);

  logger.info(`Usuario creado: ${user.firstName} ${user.lastName}`);
  return { user, token };
};
