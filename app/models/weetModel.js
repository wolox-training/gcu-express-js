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
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'weets'
    }
  );

  Weet.associate = ({ user }) => {
    Weet.belongsTo(user, { foreignKey: 'user_id' });
  };

  return Weet;
};
