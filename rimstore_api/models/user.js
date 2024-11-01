const { DataTypes } = require("@sequelize/core");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    first_name: { type: DataTypes.STRING(100), allowNull: false },
    last_name: { type: DataTypes.STRING(100), allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = User;
