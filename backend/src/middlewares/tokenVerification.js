require("dotenv").config();
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");

/**
 * Middleware to verify access token from Authorization header.
 *
 * Expected header format:
 *   Authorization: Bearer <token>
 */
function verifyAccessToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach decoded payload to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired!" });
    }
    return res.status(401).json({ message: "Invalid access token" });
  }
}

/**
 * Middleware to verify the refresh token from HTTP-only cookie.
 * Ensures the token is valid, unexpired, and not previously used.
 */
async function verifyRefreshToken(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    // Check if token exists in database (hasn't been used yet)
    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Verify token integrity
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // Attach decoded payload to request (for issuing a new access token)
    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token!" });
  }
}

module.exports = { verifyAccessToken, verifyRefreshToken };
