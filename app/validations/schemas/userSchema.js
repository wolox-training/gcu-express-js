const errorMessages = require('../../constants/errorMessages');
const emailSchema = require('./emailSchema');
const passwordSchema = require('./passwordSchema');

module.exports = {
  firstName: {
    in: 'body',
    optional: false,
    notEmpty: true,
    errorMessage: errorMessages.firstNameRequired
  },
  lastName: {
    in: 'body',
    optional: false,
    notEmpty: true,
    errorMessage: errorMessages.lastNameRequired
  },
  email: emailSchema,
  password: passwordSchema
};
