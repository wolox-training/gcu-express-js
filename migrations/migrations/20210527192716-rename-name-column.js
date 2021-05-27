'use strict';

module.exports = {
  up: queryInterface => queryInterface.renameColumn('users', 'name', 'first_name'),

  down: queryInterface => queryInterface.renameColumn('users', 'first_name', 'name')
};
