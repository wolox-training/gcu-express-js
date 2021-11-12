const { validationResult, checkSchema } = require('express-validator');

const logger = require('../logger');
const { validationError } = require('../errors');

const validateSchema = schema => [
  checkSchema(schema),
  (req, _, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) next();
    else {
      const errorMessage = errors.array()[0].msg;

      logger.error(`Validation error: ${req.path}: ${errorMessage}`);
      next(validationError(errorMessage));
    }
  }
];

module.exports = validateSchema;
