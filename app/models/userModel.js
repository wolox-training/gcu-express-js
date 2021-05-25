module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
      },
      firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
      },
      email: { type: DataTypes.STRING, allowNull: false, unique: true }
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'users'
    }
  );
  return User;
};
