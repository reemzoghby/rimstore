require("dotenv").config(); // Load environment variables first

const express = require("express");
const cors = require('cors');
const { sequelize } = require("./models");
const routes = require("./routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", routes);

// Start the server after syncing the database
const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: true }) // Use { force: true } for development to reset tables
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });
