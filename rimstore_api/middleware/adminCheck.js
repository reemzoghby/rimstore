const requireAdmin = (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).send("Admin Access Required");
  }
  next();
};

module.exports = requireAdmin;
