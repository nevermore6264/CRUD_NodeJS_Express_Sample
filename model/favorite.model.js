module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define("Favorite", {
    storyId: {
      type: DataTypes.INTEGER,
      references: { model: "Stories", key: "id" },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "Users", key: "id" },
    },
  });

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.Story, { foreignKey: "storyId", as: "story" });
    Favorite.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return Favorite;
};
