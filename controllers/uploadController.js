const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const CsvRecord = require("../models/CsvRecord");

exports.handleUpload = (req, res) => {
  console.log("📥 Upload request received");

  if (!req.file) {
    console.log("❌ No file uploaded");
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      results.push({
        name: data.name,
        email: data.email,
      });
    })
    .on("end", async () => {
      try {
        await CsvRecord.insertMany(results);
        console.log("✅ Data saved to MongoDB:", results.length, "records");
        res.json({
          message: "CSV data uploaded and saved to database",
          count: results.length,
        });
      } catch (err) {
        console.error("❌ Error saving data to DB:", err);
        res.status(500).json({ message: "Error saving data to database" });
      }
    });
};
