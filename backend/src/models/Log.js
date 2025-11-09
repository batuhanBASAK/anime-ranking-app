require("dotenv").config();
const mongoose = require("mongoose");

const LogSchema = mongoose.Schema({
  header: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Log", LogSchema);
