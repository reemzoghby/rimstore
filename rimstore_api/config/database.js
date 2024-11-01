const { Sequelize } = require("@sequelize/core");

const sequelize = new Sequelize({
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
