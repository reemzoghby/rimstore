const express = require("express");
const { Order } = require("../models");
const authenticateToken = require("../middleware/authenticateUser");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    let totalAmount = 0;
    for (const item of req.body.items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) return res.status(404).send(`Product ID ${item.product_id} not found`);
      totalAmount += product.price * item.quantity;
    }

    const newOrder = await Order.create({
      user_id: req.user.user_id,
      total_amount: totalAmount,
    });

    const orderItems = req.body.items.map((item) => ({
      order_id: newOrder.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));
    await OrderItem.bulkCreate(orderItems);

    res.status(201).json({ order: newOrder, items: orderItems });
  } catch (error) {
    res.status(500).send("Error creating order");
  }
});

module.exports = router;
