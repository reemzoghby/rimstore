const { DataTypes } = require("@sequelize/core");
const sequelize = require("../config/database");

const { Order } = require("./order");
const { Product } = require("./product");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    order_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      references: { model: Order, key: "order_id" },
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: { model: Product, key: "product_id" },
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    tableName: "orderitems",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = OrderItem;
