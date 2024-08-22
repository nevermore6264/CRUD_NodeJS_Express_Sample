module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
  });

  Category.associate = (models) => {
    Category.hasMany(models.Story, {
      foreignKey: "categoryId",
      as: "stories",
    });
  };

  return Category;
};
