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
    product_name: { type: DataTypes.STRING(255), allowNull: false },
    description: DataTypes.TEXT,
    category: DataTypes.STRING(100),
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    tableName: "product",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Product;
