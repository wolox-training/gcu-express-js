'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(t =>
      Promise.all([
        queryInterface.addColumn(
          'users',
          'password',
          { type: Sequelize.DataTypes.STRING, allowNull: false },
          { transaction: t }
        )
      ])
    ),

  down: queryInterface =>
    queryInterface.sequelize.transaction(t =>
      Promise.all([queryInterface.removeColumn('users', 'password', { transaction: t })])
    )
};
