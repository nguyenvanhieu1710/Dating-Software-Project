const express = require("express");
const upload = require("../app/middlewares/HandleUploadFile");

const router = express.Router();

// Single file upload (field: file)
router.post("/single", upload.single("file"), (req, res) => {
  console.log("File:", req.file);
  console.log("Body:", req.body);
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  res.json({
    success: true,
    message: "File uploaded successfully",
    file: {
      originalname: req.file.originalname,
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
    },
  });
});

// Multiple file upload (field: files)
router.post("/multiple", upload.array("files", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No files uploaded" });
  }
  res.json({
    success: true,
    message: "Files uploaded successfully",
    files: req.files.map((file) => ({
      originalname: file.originalname,
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      size: file.size,
    })),
  });
});

module.exports = router;
