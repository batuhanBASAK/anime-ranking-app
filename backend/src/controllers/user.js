// controllers/user.js
const User = require("../models/User");
const { rateAnime, updateAnimeRating } = require("../utils/animeUtils");

/**
 * @desc Get current authenticated user's info
 * @route GET /user/me
 */
async function getUserController(req, res) {
  try {
    // tokenVerification middleware attaches decoded token payload
    const username = req.user?.username;

    if (!username) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user found in token" });
    }

    const user = await User.findOne({ username }).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("❌ Error in getUserController:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * @desc Rate a new anime
 * @route POST /user/anime/:slug/:rating
 */
async function postAnimeController(req, res) {
  try {
    const { slug, rating } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const numericRating = parseInt(rating, 10);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 10) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 10" });
    }

    const updatedAnime = await rateAnime(slug, userId, numericRating);

    return res.status(200).json({
      message: `Successfully rated "${slug}" with ${numericRating}`,
    });
  } catch (error) {
    console.error("❌ Error in postAnimeController:", error.message);
    return res.status(400).json({ message: error.message });
  }
}

/**
 * @desc Update an existing anime rating by user
 * @route PUT /user/anime/:slug/:rating
 * @access Private
 */
async function putAnimeController(req, res) {
  try {
    const { slug, rating } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "User ID missing" });
    }

    const numericRating = parseInt(rating, 10);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 10) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 10" });
    }

    const updatedAnime = await updateAnimeRating(slug, userId, numericRating);

    return res.status(200).json({
      message: `Successfully updated rating for "${slug}" to ${numericRating}`,
    });
  } catch (error) {
    console.error("❌ Error in putAnimeController:", error.message);
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getUserController,
  postAnimeController,
  putAnimeController,
};
