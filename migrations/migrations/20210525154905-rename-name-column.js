'use strict';

module.exports = {
  up: queryInterface => queryInterface.renameColumn('tableName', 'name', 'first_name'),

  down: queryInterface => queryInterface.renameColumn('tableName', 'first_name', 'name')
};
