const { check } = require('express-validator');
const errorMessages = require('../constants/errorMessages');

exports.validateLogin = [
  check('email', errorMessages.emailRequired).notEmpty(),
  check('email', errorMessages.invalidEmail).isEmail(),
  check('email', errorMessages.invalidEmail).custom(email => {
    if (
      !email
        .trim()
        .toLowerCase()
        .includes('@wolox')
    ) {
      throw new Error(errorMessages.invalidEmailResource);
    }

    return true;
  }),
  check('password', errorMessages.passwordRequired).notEmpty(),
  check('password', errorMessages.invalidPassword).isLength({ min: 8 }),
  check('password', errorMessages.invalidPassword).isAlphanumeric()
];

exports.validateRegister = [
  check('firstName', errorMessages.nameRequired).notEmpty(),
  check('lastName', errorMessages.lastNameRequired).notEmpty(),
  ...this.validateLogin
];
