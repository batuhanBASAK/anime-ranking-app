require("dotenv").config();
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");

/**
 * Generates a short-lived access token.
 *
 * @param {Object} user - User object or payload (e.g. { id, username, role })
 * @returns {string} - Signed JWT access token
 */
function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXP || "15m" }
  );
}

/**
 * Generates a refresh token, stores it in the DB,
 * and returns the signed token.
 *
 * @param {Object} user - User object or payload (e.g. { id, username, role })
 * @returns {Promise<string>} - Signed JWT refresh token
 */
async function generateRefreshToken(user) {
  // Generate token string
  const refreshToken = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXP }
  );

  // Save it in database to prevent reuse
  await RefreshToken.create({
    token: refreshToken,
    createdAt: new Date(),
  });

  return refreshToken;
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
