module.exports = (sequelize, DataTypes) => {
  const Weet = sequelize.define(
    'weet',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
      }
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'weets'
    }
  );

  Weet.associate = ({ user, calification }) => {
    Weet.hasMany(calification);
    Weet.belongsTo(user, { foreignKey: 'user_id' });
  };

  return Weet;
};
