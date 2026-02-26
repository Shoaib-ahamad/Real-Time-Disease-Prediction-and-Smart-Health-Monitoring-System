require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");

// Import routes
const authRoutes = require("./routes/authRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const mlRoutes = require("./routes/mlRoutes");
const chatRoutes = require("./routes/chatRoutes");

connectDB();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Rate limiter for chat
const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each user to 5 requests per 10 minutes
  message: {
    reply: "Too many AI requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register all routes
app.use("/api/auth", authRoutes);
app.use("/api/predict", predictionRoutes);
app.use("/api/ml", mlRoutes);  // ← THIS WAS MISSING
app.use("/api/chat", aiLimiter, chatRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Routes registered:`);
  console.log(`- /api/auth`);
  console.log(`- /api/predict`);
  console.log(`- /api/ml`);
  console.log(`- /api/chat (rate limited)`);
});