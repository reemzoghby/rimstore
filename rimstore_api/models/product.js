const { DataTypes } = require("@sequelize/core");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // Assuming description can be null
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true, // Assuming category can be null
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true, // Set to false if every product must have an image
      validate: {
        isUrl: true, // Ensures the value is a valid URL
      },
    },
  },
  {
    tableName: "product",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Product;
