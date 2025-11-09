// controllers/api.js
const {
  getPaginatedAnimes,
  getAnimeBySlug,
  createAnime,
} = require("../utils/animeUtils");

const { saveLog } = require("../utils/logUtils");

const Anime = require("../models/Anime");

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

    const totalCount = await Anime.countDocuments();

    return res.status(200).json({ animes, totalCount });
  } catch (error) {
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
    return res.status(500).json({ message: "Server error" });
  }
}

async function postAnimeController(req, res) {
  try {
    const { name, slug, description } = req.body;

    // --- Validate input ---
    if (!name || !slug || !description) {
      return res.status(400).json({
        message: "Missing required fields (name, slug, description).",
      });
    }

    // Check if slug already exists
    const existing = await Anime.findOne({ slug: slug.toLowerCase().trim() });
    if (existing) {
      return res
        .status(409)
        .json({ message: `Anime with slug "${slug}" already exists.` });
    }

    // --- Create the anime ---
    const newAnime = await createAnime(
      name.trim(),
      slug.toLowerCase().trim(),
      description.trim()
    );

    return res.status(201).json({
      message: `Anime "${name}" created successfully.`,
      anime: newAnime,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getAnimesController,
  getAnimeController,
  postAnimeController,
};
