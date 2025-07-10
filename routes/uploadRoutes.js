console.log("✅ uploadRoutes.js loaded");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const uploadController = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/test", (req, res) => {
  console.log("📩 Upload test route hit");
  res.send("Upload route is working!");
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("📁 Saving file to uploads/");
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    console.log("💾 Filename generated:", filename);
    cb(null, filename);
  },
});


const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  console.log("📦 Uploading file with extension:", ext);
  if (ext === ".csv" || ext === ".xlsx" || ext === ".xls") {
    cb(null, true);
  } else {
    console.log("❌ Invalid file type:", ext);
    cb(new Error("Only CSV, XLSX, and XLS files are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

router.post("/", authMiddleware, upload.single("file"), uploadController.handleUpload);

module.exports = router;
