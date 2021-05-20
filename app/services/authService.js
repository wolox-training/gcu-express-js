const { sequelize, Sequelize } = require('../models');
const UserModel = require('../models/userModel')(
  sequelize,
  Sequelize.DataTypes
);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../logger');
const { databaseError, errorMessages } = require('../errors');

// Service
const userService = {
  async encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },

  async generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '30m'
    });
  },

  async signUp({ name, last_name, email, password }) {
    const existUser = await UserModel.findOne({ where: { email } });
    if (existUser) {
      logger.error('Usuario existente');
      throw databaseError(errorMessages.existingUser);
    }

    const hash = await this.encryptPassword(password);

    const user = await UserModel.create({
      name,
      last_name,
      email: email.trim().toLowerCase(),
      password: hash
    });

    const token = await this.generateToken(user.id);

    logger.info(`Usuario creado: ${user.name} ${user.last_name}`);
    return { user, token };
  }
};

module.exports = userService;
