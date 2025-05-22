const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(5000, () => console.log("Server Running on port 5000"))
  )
  .catch((err) => console.log(err));
