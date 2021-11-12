'use strict';

module.exports = {
  up: queryInterface => queryInterface.renameColumn('weets', 'userId', 'user_id'),
  down: queryInterface => queryInterface.renameColumn('weets', 'user_id', 'userId')
};
