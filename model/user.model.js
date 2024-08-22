module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("Admin", "User"),
      allowNull: false,
      defaultValue: "User",
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Comment, { foreignKey: "userId", as: "comments" });
    User.hasMany(models.Favorite, { foreignKey: "userId", as: "favorites" });
  };

  return User;
};
