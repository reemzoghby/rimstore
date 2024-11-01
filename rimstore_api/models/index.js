const sequelize = require("../config/database");
const Product = require("./product");
const User = require("./user");
const Order = require("./order");
const OrderItem = require("./orderItem");

// User.hasMany(Order, { foreignKey: "user_id" })
// Order.belongsTo(User, { foreignKey: "user_id" })

// Order.hasMany(OrderItem, { foreignKey: "order_id" })
// OrderItem.belongsTo(Order, { foreignKey: "order_id" })

// Product.hasMany(OrderItem, { foreignKey: "product_id" })
// OrderItem.belongsTo(Product, { foreignKey: "product_id" })

module.exports = { sequelize, Product, User, Order, OrderItem };
