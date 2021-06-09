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
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        // eslint-disable-next-line new-cap
        type: DataTypes.ENUM(['user', 'admin']),
        defaultValue: 'user'
      },
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
      }
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'users'
    }
  );

  User.associate = ({ weet, calification }) => {
    User.hasMany(weet);
    User.hasMany(calification);
  };

  return User;
};
