const { verifyToken } = require("../utils/token");
const User = require("../models/users");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ Error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ Error: "Invalid or expired token" });
  }
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied: Insufficient permissions" });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };
