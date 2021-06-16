// const errorMessages = require('../../constants/errorMessages');
// const passwordSchema = require('./passwordSchema');

module.exports = {
  code: {
    in: 'body',
    optional: false,
    notEmpty: true,
    errorMessage: 'Codigo requerido'
  }
};
