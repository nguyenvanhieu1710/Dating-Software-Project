const fs = require("fs");
const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "../../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Đặt tên file là originalname, có thể custom thêm timestamp nếu muốn
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

module.exports = upload;
