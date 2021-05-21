const { validationResult } = require('express-validator');
const { validationError } = require('../errors');

function checkValidations(req, res, next) {
  const errorList = validationResult(req);

  if (!errorList.isEmpty()) throw validationError(errorList.array()[0].msg);

  next();
}

module.exports = checkValidations;
