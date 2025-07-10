const express = require("express");
const router = express.Router();
const CsvRecord = require("../models/CsvRecord");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admins only" });
    }

    const records = await CsvRecord.find();
    res.json(records);
  } catch (err) {
    console.error("Error fetching CSV records:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
