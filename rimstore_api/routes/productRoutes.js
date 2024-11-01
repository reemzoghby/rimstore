// Import necessary libraries and modules
const express = require("express");
const { Product } = require("../models");

// Import middleware for authentication and admin authorization
const authenticateToken = require("../middleware/authenticateUser");
const requireAdmin = require("../middleware/adminCheck");

// Create an Express router instance
const router = express.Router();

/**
 * @route GET /
 * @description Fetches all products from the database
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).send("Error fetching products");
  }
});

/**
 * @route POST /
 * @description Creates a new product (admin access required)
 * @access Private (Requires admin privileges)
 */
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Create a new product using the data from the request body
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Error creating product");
  }
});

/**
 * @route GET /:product_id
 * @description Fetches a product by its ID
 * @access Public
 */
router.get("/:product_id", async (req, res) => {
  try {
    // Find the product by its primary key (product_id)
    const product = await Product.findByPk(req.params.product_id);
    if (product) res.json(product);
    else res.status(404).send("Product Not Found");
  } catch (error) {
    res.status(500).send("Error fetching product");
  }
});

/**
 * @route PUT /:product_id
 * @description Updates a product by its ID (admin access required)
 * @access Private (Requires admin privileges)
 */
router.put("/:product_id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Update the product with the new data from the request body
    const [updated] = await Product.update(req.body, {
      where: { product_id: req.params.product_id },
    });

    // If the product was updated, fetch and return the updated product
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.product_id);
      res.json(updatedProduct);
    } else {
      res.status(404).send("Product Not Found");
    }
  } catch (error) {
    res.status(500).send("Error updating product");
  }
});

/**
 * @route DELETE /:product_id
 * @description Deletes a product by its ID (admin access required)
 * @access Private (Requires admin privileges)
 */
router.delete("/:product_id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Delete the product by its primary key (product_id)
    const deleted = await Product.destroy({
      where: { product_id: req.params.product_id },
    });
    if (deleted) res.send("Product Deleted");
    else res.status(404).send("Product Not Found");
  } catch (error) {
    res.status(500).send("Error deleting product");
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
