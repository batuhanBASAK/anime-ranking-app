const mongoose = require("mongoose");

const AnimeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  description: {
    type: String,
    required: true,
  },

  // --- Rating counts ---
  ratingCounts: {
    1: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    5: { type: Number, default: 0 },
    6: { type: Number, default: 0 },
    7: { type: Number, default: 0 },
    8: { type: Number, default: 0 },
    9: { type: Number, default: 0 },
    10: { type: Number, default: 0 },
  },

  // --- Rating user lists ---
  ratingUsers: {
    1: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    2: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    3: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    4: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    5: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    6: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    7: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    8: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    9: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    10: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },

  // --- Overall statistics ---
  totalRatings: {
    type: Number,
    default: 0,
  },

  totalRatingValue: {
    type: Number,
    default: 0,
  },

  overallRating: {
    type: Number,
    default: 0, // weighted average (totalRatingValue / totalRatings)
  },

  ranking: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Anime", AnimeSchema);
