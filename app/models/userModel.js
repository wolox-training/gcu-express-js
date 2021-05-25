module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
      },

      name: { type: DataTypes.STRING },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
      },
      email: { type: DataTypes.STRING, allowNull: false, unique: true }
    },
    {
      timestamps: false
    }
  );
  return User;
};
