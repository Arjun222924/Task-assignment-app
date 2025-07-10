const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // ✅ Added for React build
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/agents", require("./routes/agentRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/records", require("./routes/csvRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

console.log("✅ All routes registered");

// ✅ Serve React frontend build
app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// ✅ 404 handler (only for API routes that don't match)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(404).json({ message: `🚫 Route not found: ${req.originalUrl}` });
  }
  next();
});

const PORT = process.env.PORT || 5000;
console.log("🔌 Connecting to MongoDB:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
