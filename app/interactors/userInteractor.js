const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userInteractor = {
  async encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },

  async generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '30m'
    });
  }
};

module.exports = userInteractor;
