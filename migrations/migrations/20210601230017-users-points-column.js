'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'points', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
  }
};
