module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("Category", {
      name: { type: DataTypes.STRING, allowNull: false },
    }, {
      timestamps: false, // Disable timestamps
    });
  
    Category.associate = (models) => {
      Category.hasMany(models.Product, {
        foreignKey: 'categoryId',
        as: 'products'
      });
    };
  
    return Category;
  };