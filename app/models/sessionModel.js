module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    'session',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
      },
      logoutTime: {
        type: DataTypes.DATE,
        default: Date.now(),
        allowNull: false
      }
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'sessions'
    }
  );

  Session.associate = ({ user }) => {
    Session.belongsTo(user, { foreignKey: 'user_id' });
  };

  return Session;
};
