const express = require("express");

const {
  getAnimesController,
  getAnimeController,
  postAnimeController,
} = require("../controllers/api");

const { verifyAccessToken } = require("../middlewares/tokenVerification");
const { verifyAdmin } = require("../middlewares/adminVerification");

const apiRouter = express.Router();

apiRouter.get("/animes/:start/:n", getAnimesController);
apiRouter.get("/anime/:slug", getAnimeController);
apiRouter.post("/anime", verifyAccessToken, verifyAdmin, postAnimeController);

module.exports = apiRouter;
