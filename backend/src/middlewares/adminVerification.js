/**
 * Middleware to ensure the user has the "admin" role.
 * Requires verifyAccessToken to have already run before it.
 */
function verifyAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user not found in request." });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: admin privileges required." });
    }

    next();
  } catch (error) {
    console.error("❌ Error in verifyAdmin middleware:", error.message);
    return res
      .status(500)
      .json({ message: "Server error during role verification." });
  }
}

module.exports = { verifyAdmin };
