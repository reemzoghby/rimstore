const express = require("express");
const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");
const orderRoutes = require("./orderRoutes");
const adminOrdersRoutes = require("./adminOrders"); // Import adminOrders route

const router = express.Router();

// Mount regular routes
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);

// Mount admin routes under /admin prefix
router.use("/admin", adminOrdersRoutes);

module.exports = router;
