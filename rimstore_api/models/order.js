const { DataTypes } = require("@sequelize/core");
const sequelize = require("../config/database");

const { User } = require("./user");

const Order = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: User, key: "user_id" },
    },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    order_status: { type: DataTypes.STRING(50), defaultValue: "pending" },
  },
  {
    tableName: "order",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Order;
