const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

function generateToken(user) {
  return jwt.sign(
    { user_id: user.user_id, is_admin: user.is_admin },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = { hashPassword, generateToken };
