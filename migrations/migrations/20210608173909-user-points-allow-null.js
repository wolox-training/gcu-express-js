'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.changeColumn('users', 'points', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    }),
  down: (queryInterface, Sequelize) =>
    queryInterface.changeColumn('users', 'points', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true
    })
};
