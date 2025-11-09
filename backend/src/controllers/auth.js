// controllers/auth.js
require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");

const { saveLog } = require("../utils/logUtils");

/**
 * Register new user
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = await generateRefreshToken(newUser);

    // Store refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: Number(process.env.REFRESH_TOKEN_EXP_IN_MS),
    });

    await saveLog(
      "register",
      `new user with username ${newUser.username} has been registered`
    );
    return res.status(200).json({
      message: "User registered successfully",
      accessToken,
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        animesRated: newUser.animesRated,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * Login user
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: Number(process.env.REFRESH_TOKEN_EXP_IN_MS),
    });

    await saveLog(
      "login",
      `user with username ${user.username} has been logged in`
    );
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        animesRated: user.animesRated,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * Logout user — delete refresh token from DB
 */
async function logout(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(400).json({ message: "Refresh token missing" });
    }

    await RefreshToken.deleteOne({ token });

    const username = req.user.username;

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
    });
    await saveLog(
      "logout",
      `user with username ${username} has been logged out`
    );
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * Refresh access and refresh tokens
 */
async function refresh(req, res) {
  try {
    const oldToken = req.cookies?.refreshToken;
    if (!oldToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    // Delete old refresh token from DB (one-time use policy)
    await RefreshToken.deleteOne({ token: oldToken });

    const username = req.user.username;
    const user = await User.findOne({ username });

    // Issue new tokens
    const accessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    // Set new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: Number(process.env.REFRESH_TOKEN_EXP_IN_MS),
    });

    return res.status(200).json({
      message: "Tokens refreshed successfully",
      accessToken,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
}

module.exports = {
  register,
  login,
  logout,
  refresh,
};
