require("./config/dotenv");

const express = require("express");
const { sequelize } = require("./models");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use("/", routes);

const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
