const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const authToken = req.headers["authorization"];
    console.log(authToken);
  if (!authToken) {
    return res.status(401).send("Access Denied");
  }

  const verifyTokenCallback = (err, user) => {
    if (err) {
      return res.status(403).send("Invalid Token");
    }
    req.user = user;
    next();
  };

  jwt.verify(authToken, process.env.JWT_SECRET, verifyTokenCallback);
};

module.exports = authenticateUser;
