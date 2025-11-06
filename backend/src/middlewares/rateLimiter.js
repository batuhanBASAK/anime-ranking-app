const rateLimit = require("express-rate-limit");

// Global rate limit middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true, // return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

module.exports = limiter;
