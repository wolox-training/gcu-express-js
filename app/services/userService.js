const { sequelize, Sequelize } = require('../models');
const UserModel = require('../models/userModel')(
  sequelize,
  Sequelize.DataTypes
);
const {
  encryptPassword,
  generateToken
} = require('../interactors/userInteractor');
const logger = require('../logger');
const { databaseError, errorMessages } = require('../errors');

// Service
const userService = {
  async signUp({ name, last_name, email, password }) {
    const existUser = await UserModel.findOne({ where: { email } });
    if (existUser) {
      logger.error('Usuario existente');
      throw databaseError(errorMessages.existingUser);
    }

    const hash = await encryptPassword(password);

    const user = await UserModel.create({
      name,
      last_name,
      email: email.trim().toLowerCase(),
      password: hash
    });

    const token = await generateToken(user.id);

    logger.info(`Usuario creado: ${user.name} ${user.last_name}`);
    return { user, token };
  }
};

module.exports = userService;
