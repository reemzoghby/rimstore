// Import necessary libraries and modules
const express = require("express");
const bcrypt = require("bcryptjs");

// Import User model and utility functions
const { User } = require("../models/index.js");
const { hashPassword, generateToken } = require("../utils.js");

// Import middleware for authentication and admin check
const requireAdmin = require("../middleware/adminCheck");
const authenticateToken = require("../middleware/authenticateUser");

// Create an Express router instance
const router = express.Router();

/**
 * @route POST /signup
 * @description Registers a new user by hashing their password and saving the user details to the database
 * @access Public
 */
router.post("/signup", async (req, res) => {
  try {
    // Hash the user's password before saving
    const hashedPassword = await hashPassword(req.body.password);

    // Create a new user with the provided details and hashed password
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    // Respond with the created user (excluding sensitive data)
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).send("Error signing up");
  }
});

/**
 * @route POST /login
 * @description Authenticates a user by comparing the provided password with the stored hashed password, and returns a JWT token
 * @access Public
 */
router.post("/login", async (req, res) => {
  try {
    // Find the user by their email address
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(404).send("User not found");

    // Compare the provided password with the stored hashed password
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) return res.status(401).send("Invalid password");

    // Generate a JWT token for the authenticated user
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send("Error logging in");
  }
});

/**
 * @route GET /
 * @description Retrieves all users from the database (admin access required)
 * @access Private (Requires admin privileges)
 */
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).send("Error fetching users");
  }
});

/**
 * @route GET /:user_id
 * @description Retrieves a user by their user ID
 * @access Private (Requires user authentication)
 */
router.get("/:user_id", authenticateToken, async (req, res) => {
  try {
    // Find the user by their primary key (user_id)
    const user = await User.findByPk(req.params.user_id);
    if (user) res.json(user);
    else res.status(404).send("User Not Found");
  } catch (error) {
    res.status(500).send("Error fetching user");
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
