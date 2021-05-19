const { sequelize, Sequelize } = require('../models');
const UserModel = require('../models/userModel')(
  sequelize,
  Sequelize.DataTypes
);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

  async signUp({ name, surname, email, password }) {
    const existUser = await UserModel.findOne({ where: { email } });
    if (existUser) throw new Error('Usuario existente');

    const hash = await this.encryptPassword(password);

    const user = await UserModel.create({
      name,
      surname,
      email: email.trim().toLowerCase(),
      password: hash
    });

    const token = await this.generateToken(user.id);

    return { user, token };
  }
};

module.exports = userService;
