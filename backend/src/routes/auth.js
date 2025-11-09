const express = require("express");
const { login, logout, register, refresh } = require("../controllers/auth");
const { verifyRefreshToken } = require("../middlewares/tokenVerification");
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", verifyRefreshToken, logout);
authRouter.post("/refresh", verifyRefreshToken, refresh);

module.exports = authRouter;
