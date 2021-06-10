const errorMessages = require('../../constants/errorMessages');

module.exports = {
  score: {
    in: 'body',
    optional: false,
    notEmpty: true,
    errorMessage: errorMessages.scoreRequired,
    isIn: {
      options: [[1, -1]],
      errorMessage: errorMessages.invalidScore
    }
  }
};
