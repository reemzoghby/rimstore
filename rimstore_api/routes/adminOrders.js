const express = require("express");
const { Op } = require("sequelize");
const { Order, OrderItem, User, Product } = require("../models");
const authenticateUser = require("../middleware/authenticateUser");
const requireAdmin = require("../middleware/adminCheck");

const router = express.Router();

/**
 * @route GET /admin/orders
 * @description Retrieves all orders with their order items and associated user and product details
 * @access Private (Admin Only)
 */
router.get("/orders", authenticateUser, requireAdmin, async (req, res) => {
  try {
    // Fetch all orders
    const ordersFromDB = await Order.findAll();
    const orders = ordersFromDB.map(order => order.get({ plain: true }));

    const userIds = [...new Set(orders.map(order => order.user_id))];
    const orderIds = orders.map(order => order.order_id);

    // Fetch associated users
    const users = await User.findAll({
      where: {
        user_id: { [Op.in]: userIds },
      },
      attributes: ["user_id", "email", "first_name", "last_name"],
    });

    // Fetch associated order items
    const orderItems = await OrderItem.findAll({
      where: {
        order_id: { [Op.in]: orderIds },
      },
      attributes: ["order_item_id", "order_id", "product_id", "quantity", "price"],
    });

    // Fetch associated products
    const productIds = [...new Set(orderItems.map(item => item.product_id))];
    const products = await Product.findAll({
      where: {
        product_id: { [Op.in]: productIds },
      },
      attributes: ["product_id", "product_name", "description", "price"],
    });

    // Map users, products, and order items
    const usersMap = users.reduce((acc, user) => {
      acc[user.user_id] = user;
      return acc;
    }, {});

    const productsMap = products.reduce((acc, product) => {
      acc[product.product_id] = product;
      return acc;
    }, {});

    const orderItemsMap = orderItems.reduce((acc, item) => {
        if (!acc[item.order_id]) acc[item.order_id] = [];
        const product = productsMap[item.product_id];
        acc[item.order_id].push({
          ...item.get({ plain: true }),
          product_name: product?.product_name || "Unknown Product",
          product_description: product?.description || "No description available",
          product_price: product && product.price != null ? parseFloat(product.price) : 0, // Ensure proper price handling
        });
        return acc;
      }, {});
      
    // Combine orders with users and order items
    const enrichedOrders = orders.map(order => ({
        ...order,
        total_amount: parseFloat(order.total_amount) || 0, // Ensure total_amount is a number
        user: usersMap[order.user_id],
        order_items: orderItemsMap[order.order_id] || [],
      }));

    res.json(enrichedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Error fetching orders");
  }
});

module.exports = router;
