module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    categoryId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories', // Name of the table to reference
        key: 'id'
      }
    }
  }, {
    timestamps: false, // Disable timestamps
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
  };

  return Product;
};