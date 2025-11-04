const Anime = require("../models/Anime");
const User = require("../models/User");

/**
 * Creates a new anime entry and saves it to the database.
 * Automatically assigns the lowest rank (maxRank + 1).
 *
 * @param {string} name - The name of the anime.
 * @param {string} slug - The unique slug for the anime.
 * @param {string} description - A short description of the anime.
 * @returns {Promise<Object>} The saved Anime document.
 */
async function createAnime(name, slug, description) {
  try {
    // Find the current highest rank
    const lastRankedAnime = await Anime.findOne().sort({ ranking: -1 }).lean();
    const newRanking = lastRankedAnime ? lastRankedAnime.ranking + 1 : 1;

    // Create and save the new anime
    const newAnime = new Anime({
      name,
      slug,
      description,
      ranking: newRanking,
    });

    await newAnime.save();

    console.log(
      `✅ Anime "${name}" created successfully with rank ${newRanking}.`
    );
    return newAnime;
  } catch (error) {
    console.error("❌ Error creating anime:", error.message);
    throw error;
  }
}

/**
 * Updates ranks of all animes based on overallRating.
 * Rank 1 = highest rated anime.
 */
async function updateAnimeRanks() {
  try {
    // Fetch all animes sorted by rating (highest first)
    const animes = await Anime.find().sort({ overallRating: -1 });

    // Assign ranks
    const bulkOps = animes.map((anime, i) => ({
      updateOne: {
        filter: { _id: anime._id },
        update: { $set: { ranking: i + 1 } },
      },
    }));

    // Execute bulk update
    if (bulkOps.length > 0) {
      await Anime.bulkWrite(bulkOps);
    }

    console.log("✅ Anime ranks updated successfully.");
  } catch (error) {
    console.error("❌ Error updating anime ranks:", error);
  }
}

/**
 * Fetches a paginated list of animes based on ranking order.
 * Rank 1 = highest rated anime.
 *
 * @param {number} startIndex - The index of the first anime to fetch (0-based).
 * @param {number} numberOfAnimes - The number of animes to fetch.
 * @returns {Promise<Array>} A list of animes with selected fields.
 */
async function getPaginatedAnimes(startIndex, numberOfAnimes) {
  try {
    // Ensure startIndex and numberOfAnimes are valid numbers
    const skip = Math.max(0, startIndex);
    const limit = Math.max(1, numberOfAnimes);

    // Fetch paginated results sorted by ranking (ascending: 1 = top)
    const animes = await Anime.find(
      {},
      {
        name: 1,
        slug: 1,
        description: 1,
        ratingCounts: 1,
        totalRatings: 1,
        totalRatingValue: 1,
        overallRating: 1,
        ranking: 1,
        _id: 0,
      }
    )
      .sort({ ranking: 1 }) // lowest rank number = best
      .skip(skip)
      .limit(limit)
      .lean();

    return animes;
  } catch (error) {
    console.error("❌ Error fetching paginated animes:", error.message);
    throw error;
  }
}

/**
 * Fetches a single anime by its slug.
 * Returns the same fields as getPaginatedAnimes.
 *
 * @param {string} slug - The unique slug of the anime.
 * @returns {Promise<Object|null>} The anime data if found, otherwise null.
 */
async function getAnimeBySlug(slug) {
  try {
    if (!slug || typeof slug !== "string") {
      throw new Error("Invalid slug provided.");
    }

    const anime = await Anime.findOne(
      { slug: slug.toLowerCase().trim() },
      {
        name: 1,
        slug: 1,
        description: 1,
        ratingCounts: 1,
        totalRatings: 1,
        totalRatingValue: 1,
        overallRating: 1,
        ranking: 1,
        _id: 0,
      }
    ).lean();

    return anime;
  } catch (error) {
    console.error("❌ Error fetching anime by slug:", error.message);
    throw error;
  }
}

/**
 * Deletes an anime from the database by its slug.
 *
 * @param {string} slug - The unique slug of the anime to delete.
 * @returns {Promise<Object|null>} The deleted anime data, or null if not found.
 */
async function deleteAnimeBySlug(slug) {
  try {
    if (!slug || typeof slug !== "string") {
      throw new Error("Invalid slug provided.");
    }

    const deletedAnime = await Anime.findOneAndDelete({
      slug: slug.toLowerCase().trim(),
    }).lean();

    if (!deletedAnime) {
      console.log(`⚠️ No anime found with slug "${slug}".`);
      return null;
    }

    console.log(
      `🗑️ Anime "${deletedAnime.name}" (slug: ${slug}) deleted successfully.`
    );
    return deletedAnime;
  } catch (error) {
    console.error("❌ Error deleting anime:", error.message);
    throw error;
  }
}

/**
 * Adds a new rating for an anime from a user (assuming the user hasn't rated it yet).
 * Updates both the Anime and User documents.
 *
 * @param {string} slug - The slug of the anime to rate.
 * @param {string} userId - The user's ID.
 * @param {number} rating - The rating given by the user (1–10).
 * @returns {Promise<Object>} The updated anime document.
 */
async function rateAnime(slug, userId, rating) {
  try {
    // --- Validate inputs ---
    if (!slug || typeof slug !== "string")
      throw new Error("Invalid slug provided.");
    if (!userId) throw new Error("User ID is required.");
    if (!Number.isInteger(rating) || rating < 1 || rating > 10)
      throw new Error("Rating must be an integer between 1 and 10.");

    // --- Fetch anime and user ---
    const [anime, user] = await Promise.all([
      Anime.findOne({ slug: slug.toLowerCase().trim() }),
      User.findById(userId),
    ]);

    if (!anime) throw new Error(`Anime with slug "${slug}" not found.`);
    if (!user) throw new Error(`User with ID "${userId}" not found.`);

    // --- Prevent duplicate rating ---
    const alreadyRated = user.animesRated.some(
      (r) => r.animeID.toString() === anime._id.toString()
    );
    if (alreadyRated) {
      throw new Error(`User ${userId} has already rated this anime.`);
    }

    // --- Update Anime data ---
    anime.ratingUsers[rating].push(userId);
    anime.ratingCounts[rating] = (anime.ratingCounts[rating] || 0) + 1;
    anime.totalRatings += 1;
    anime.totalRatingValue += rating;
    anime.overallRating =
      anime.totalRatings > 0 ? anime.totalRatingValue / anime.totalRatings : 0;

    await anime.save();

    // --- Update User data ---
    user.animesRated.push({
      animeID: anime._id,
      rating,
    });

    await user.save();

    return anime;
  } catch (error) {
    console.error("❌ Error rating anime:", error.message);
    throw error;
  }
}

/**
 * Updates an existing user's rating for an anime.
 * Recalculates totalRatingValue and overallRating accordingly.
 * Updates both the Anime and User documents.
 *
 * @param {string} slug - The slug of the anime.
 * @param {string} userId - The user's ID.
 * @param {number} newRating - The new rating (1–10).
 * @returns {Promise<Object>} The updated anime document.
 */
async function updateAnimeRating(slug, userId, newRating) {
  try {
    // --- Validate inputs ---
    if (!slug || typeof slug !== "string")
      throw new Error("Invalid slug provided.");
    if (!userId) throw new Error("User ID is required.");
    if (!Number.isInteger(newRating) || newRating < 1 || newRating > 10)
      throw new Error("Rating must be an integer between 1 and 10.");

    // --- Fetch anime and user ---
    const [anime, user] = await Promise.all([
      Anime.findOne({ slug: slug.toLowerCase().trim() }),
      User.findById(userId),
    ]);

    if (!anime) throw new Error(`Anime with slug "${slug}" not found.`);
    if (!user) throw new Error(`User with ID "${userId}" not found.`);

    // --- Get previous rating directly from user data ---
    const ratedAnime = user.animesRated.find(
      (r) => r.animeID.toString() === anime._id.toString()
    );

    if (!ratedAnime) {
      throw new Error(`User ${userId} has not rated "${anime.name}" yet.`);
    }

    const previousRating = ratedAnime.rating;
    if (previousRating === newRating) {
      console.log(
        "⚠️ New rating is the same as previous one, no update performed."
      );
      return anime;
    }

    // --- Update Anime rating data ---
    // Remove user from old rating list and decrement count
    const oldList = anime.ratingUsers[previousRating];
    anime.ratingUsers[previousRating] = oldList.filter(
      (id) => id.toString() !== userId.toString()
    );
    anime.ratingCounts[previousRating] = Math.max(
      0,
      (anime.ratingCounts[previousRating] || 1) - 1
    );

    // Add user to new rating list and increment count
    anime.ratingUsers[newRating].push(userId);
    anime.ratingCounts[newRating] = (anime.ratingCounts[newRating] || 0) + 1;

    // Recalculate totals
    const totalRatings = Object.values(anime.ratingCounts).reduce(
      (sum, count) => sum + count,
      0
    );
    const totalRatingValue = Object.entries(anime.ratingCounts).reduce(
      (sum, [key, count]) => sum + Number(key) * count,
      0
    );

    anime.totalRatings = totalRatings;
    anime.totalRatingValue = totalRatingValue;
    anime.overallRating =
      totalRatings > 0 ? totalRatingValue / totalRatings : 0;

    await anime.save();

    // --- Update User document ---
    ratedAnime.rating = newRating;
    await user.save();

    return anime;
  } catch (error) {
    console.error("❌ Error updating anime rating:", error.message);
    throw error;
  }
}

module.exports = {
  createAnime,
  updateAnimeRanks,
  getPaginatedAnimes,
  getAnimeBySlug,
  deleteAnimeBySlug,
  rateAnime,
  updateAnimeRating,
};
