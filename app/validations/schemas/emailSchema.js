const errorMessages = require('../../constants/errorMessages');

module.exports = {
  in: 'body',
  optional: false,
  notEmpty: true,
  errorMessage: errorMessages.emailRequired,
  matches: {
    errorMessage: errorMessages.invalidEmail,
    options: /\S+@wolox.\S+/
  }
};
