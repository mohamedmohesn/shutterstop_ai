module.exports = function (sequelize, DataTypes) {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      storeType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "gc",
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "apparel",
      },
      responseData: {
        type: DataTypes.STRING(10000),
        allowNull: false,
        defaultValue: "",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "product",
    }
  );
  Product.associate = (models) => {
    Product.hasMany(models.ProductMedia, {
      foreginKey: "productId",
      as: "medias",
    });
    Product.belongsToMany(models.Category, {
      through: models.ProductCategory,
      foreginKey: "productId",
      otherKey: "categoryId",
      as: "cat",
    });
  };
  return Product;
};
