const express = require("express");
const bcrypt = require("bcryptjs");

const { User } = require("../models/index.js");
const { hashPassword, generateToken } = require("../utils.js");
const requireAdmin = require("../middleware/adminCheck");
const authenticateToken = require("../middleware/authenticateUser");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).send("Error signing up");
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(404).send("User not found");

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) return res.status(401).send("Invalid password");

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send("Error logging in");
  }
});

router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).send("Error fetching users");
  }
});

router.get("/:user_id", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.user_id);
    if (user) res.json(user);
    else res.status(404).send("User Not Found");
  } catch (error) {
    res.status(500).send("Error fetching user");
  }
});

module.exports = router;
