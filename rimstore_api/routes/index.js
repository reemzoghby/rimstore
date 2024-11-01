const express = require("express");
const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");
const orderRoutes = require("./orderRoutes");

const router = express.Router();

router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
