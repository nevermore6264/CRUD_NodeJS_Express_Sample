module.exports = (sequelize, DataTypes) => {
  const Story = sequelize.define("Story", {
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    status: {
      type: DataTypes.ENUM("Published", "Draft"),
      allowNull: false,
    },
    authorId: {
      type: DataTypes.INTEGER,
      references: { model: "Authors", key: "id" },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: { model: "Categories", key: "id" },
    },
  });

  Story.associate = (models) => {
    Story.belongsTo(models.Author, { foreignKey: "authorId", as: "author" });
    Story.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });
    Story.hasMany(models.Comment, { foreignKey: "storyId", as: "comments" });
    Story.hasMany(models.Favorite, { foreignKey: "storyId", as: "favorites" });
  };

  return Story;
};
