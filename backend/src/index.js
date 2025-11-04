require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cookiParser = require("cookie-parser");
const cors = require("cors");
const limiter = require("./middlewares/rateLimiter");
const app = express();

const authRouter = require("./routes/auth");
const apiRouter = require("./routes/api");

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("The database has been connected"))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(cookiParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(limiter);

app.use("/auth", authRouter);
app.use("/api", apiRouter);

app.listen(process.env.PORT, () =>
  console.log(`The server is up and running on port ${process.env.PORT}`)
);
