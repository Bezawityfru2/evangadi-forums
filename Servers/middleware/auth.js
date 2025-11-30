const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1️ Check Bearer token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized", message: "Token is missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // FIX: extract user_id (NOT userid)
    const { username, user_id } = jwt.verify(token, process.env.JWT_SECRET);

    // Attach correct user fields
    req.user = { username, user_id };

    next();
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized", message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
