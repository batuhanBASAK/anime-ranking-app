const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  animesRated: [
    {
      name: {
        // name of the anime
        type: String,
        require: true,
      },
      slug: {
        // slug of the anime
        type: String,
        require: true,
      },
      animeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Anime", // reference to Anime model
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
    },
  ],

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

module.exports = mongoose.model("User", UserSchema);
