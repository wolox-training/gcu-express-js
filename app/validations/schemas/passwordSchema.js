const errorMessages = require('../../constants/errorMessages');

module.exports = {
  in: 'body',
  optional: false,
  notEmpty: true,
  errorMessage: errorMessages.passwordRequired,
  isLength: {
    errorMessage: errorMessages.invalidPasswordLength,
    options: { min: 8 }
  },
  isAlphanumeric: {
    errorMessage: errorMessages.invalidPassword
  }
};
