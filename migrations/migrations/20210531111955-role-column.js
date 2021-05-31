'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'role', {
      // eslint-disable-next-line new-cap
      type: Sequelize.ENUM(['user', 'admin']),
      defaultValue: 'user'
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
  }
};
