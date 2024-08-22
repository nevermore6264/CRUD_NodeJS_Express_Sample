module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    content: { type: DataTypes.TEXT, allowNull: false },
    storyId: {
      type: DataTypes.INTEGER,
      references: { model: "Stories", key: "id" },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "Users", key: "id" },
    },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Story, { foreignKey: "storyId", as: "story" });
    Comment.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return Comment;
};
