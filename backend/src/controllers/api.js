// controllers/api.js
const { getPaginatedAnimes, getAnimeBySlug } = require("../utils/animeUtils");

/**
 * Controller to fetch a paginated list of animes.
 * Route: GET /api/animes/:start/:n
 */
async function getAnimesController(req, res) {
  try {
    const { start, n } = req.params;

    const startIndex = parseInt(start, 10);
    const numberOfAnimes = parseInt(n, 10);

    if (isNaN(startIndex) || isNaN(numberOfAnimes)) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    const animes = await getPaginatedAnimes(startIndex, numberOfAnimes);

    if (!animes || animes.length === 0) {
      return res.status(404).json({ message: "No animes found" });
    }

    return res.status(200).json({ animes });
  } catch (error) {
    console.error("❌ Error in getAnimesController:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * Controller to fetch a single anime by its slug.
 * Route: GET /api/anime/:slug
 */
async function getAnimeController(req, res) {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== "string") {
      return res.status(400).json({ message: "Invalid slug parameter" });
    }

    const anime = await getAnimeBySlug(slug);

    if (!anime) {
      return res
        .status(404)
        .json({ message: `Anime with slug "${slug}" not found` });
    }

    return res.status(200).json({ anime });
  } catch (error) {
    console.error("❌ Error in getAnimeController:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAnimesController,
  getAnimeController,
};
