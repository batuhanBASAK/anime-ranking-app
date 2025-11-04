const express = require("express");

const {
  getAnimesController,
  getAnimeController,
} = require("../controllers/api");

const apiRouter = express.Router();

apiRouter.get("/animes/:start/:n", getAnimesController);
apiRouter.get("/anime/:slug", getAnimeController);

module.exports = apiRouter;
