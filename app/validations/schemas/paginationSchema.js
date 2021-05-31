const errorMessages = require('../../constants/errorMessages');

module.exports = {
  page: {
    in: 'query',
    optional: true,
    // toInt works like a sanitizer
    toInt: true,
    isNumeric: {
      errorMessage: errorMessages.invalidPagePagination
    }
  },
  limit: {
    in: 'query',
    optional: true,
    // toInt works like a sanitizer
    toInt: true,
    isNumeric: {
      errorMessage: errorMessages.invalidLimitPagination
    }
  }
};
