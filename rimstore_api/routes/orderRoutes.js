const express = require("express");
const { Order } = require("../models");
const authenticateToken = require("../middleware/authenticateUser");
const { Product } = require("../models");
const { OrderItem} = require("../models");
const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    let totalAmount = 0;
    for (const item of req.body.items) {
      const product = await Product.findByPk(item.productId);
      if (!product) return res.status(404).send(`Product ID ${item.productId} not found`);
      totalAmount += product.price * item.quantity;
    }

    const newOrder = await Order.create({
      user_id: req.user.user_id,
      total_amount: totalAmount,
    });
    const getItemPrice = async (itemId , quantity) => {
      const productD = await Product.findByPk(itemId);
      const finalPrice = quantity *  productD.price;
      return finalPrice;
    }
    const orderItems = await Promise.all(
      req.body.items.map(async (item) => ({
        order_id: newOrder.order_id,
        product_id: item.productId,
        quantity: item.quantity,
        price: await getItemPrice(item.productId, item.quantity),
      }))
    );
    
    console.log('order items', orderItems);
    await OrderItem.bulkCreate(orderItems);
    

    res.status(201).json({ order: newOrder, items: orderItems });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating order");
  }
});

module.exports = router;
