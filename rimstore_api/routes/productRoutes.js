const express = require("express");
const { Product } = require("../models");
const authenticateToken = require("../middleware/authenticateUser");
const requireAdmin = require("../middleware/adminCheck");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).send("Error fetching products");
  }
});

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Error creating product");
  }
});

router.get("/:product_id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.product_id);
    if (product) res.json(product);
    else res.status(404).send("Product Not Found");
  } catch (error) {
    res.status(500).send("Error fetching product");
  }
});

router.put(
  "/:product_id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const [updated] = await Product.update(req.body, {
        where: { product_id: req.params.product_id },
      });
      if (updated) {
        const updatedProduct = await Product.findByPk(req.params.product_id);
        res.json(updatedProduct);
      } else {
        res.status(404).send("Product Not Found");
      }
    } catch (error) {
      res.status(500).send("Error updating product");
    }
  }
);

router.delete(
  "/:product_id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const deleted = await Product.destroy({
        where: { product_id: req.params.product_id },
      });
      if (deleted) res.send("Product Deleted");
      else res.status(404).send("Product Not Found");
    } catch (error) {
      res.status(500).send("Error deleting product");
    }
  }
);

module.exports = router;
