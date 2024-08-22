module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define("Author", {
    name: { type: DataTypes.STRING, allowNull: false },
    bio: { type: DataTypes.TEXT, allowNull: true },
  });

  Author.associate = (models) => {
    Author.hasMany(models.Story, { foreignKey: "authorId", as: "stories" });
  };

  return Author;
};
