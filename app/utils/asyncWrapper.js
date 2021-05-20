const logger = require('../logger');

const asyncWrapper = fn => (req, res, next, ...args) =>
  fn(req, res, next, ...args).catch(error => {
    logger.error(error);
    next(error);
  });

module.exports = asyncWrapper;
