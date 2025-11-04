const express = require("express");

const userRouter = express.Router();

const {
  getUserController,
  postAnimeController,
  putAnimeController,
} = require("../controllers/user");

const { verifyAccessToken } = require("../middlewares/tokenVerification");

// get user info
userRouter.get("/me", verifyAccessToken, getUserController);

// rate a new anime
userRouter.post("/anime/:slug/:rating", verifyAccessToken, postAnimeController);

// update rating of an anime
userRouter.put("/anime/:slug/:rating", verifyAccessToken, putAnimeController);

module.exports = userRouter;
