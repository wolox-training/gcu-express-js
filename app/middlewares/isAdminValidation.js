const { authenticationError } = require('../errors');
const errorMessages = require('../constants/errorMessages');

module.exports = (req, res, next) => {
  if (!req.user.id) return next(authenticationError(errorMessages.userNotFound));
  else if (req.user.role !== 'admin') return res.sendStatus(403);

  return next();
};
