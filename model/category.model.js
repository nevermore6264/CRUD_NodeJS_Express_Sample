module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
  });

  Category.associate = (models) => {
    Category.hasMany(models.Story, { foreignKey: "categoryId", as: "stories" });
  };

  return Category;
};
