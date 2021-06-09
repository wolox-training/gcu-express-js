module.exports = (sequelize, DataTypes) => {
  const Calification = sequelize.define(
    'calification',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      weetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'weet_id'
      },
      ratingUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'rating_user_id'
      }
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'califications'
    }
  );

  Calification.associate = ({ weet, user }) => {
    Calification.belongsTo(weet, { foreignKey: 'weet_id' });
    Calification.belongsTo(user, { foreignKey: 'rating_user_id' });
  };

  return Calification;
};
