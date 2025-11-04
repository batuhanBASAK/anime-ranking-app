require("dotenv").config();
const mongoose = require("mongoose");

const RefreshTokenSchema = mongoose.Schema({
  token: { type: String, require: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: process.env.REFRESH_TOKEN_EXP_IN_MS / 1000,
  },
});

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
