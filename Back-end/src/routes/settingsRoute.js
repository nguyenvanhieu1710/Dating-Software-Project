const express = require("express");
const SettingsController = require("../app/controllers/settingsController");
const { authenticateToken } = require("../app/middlewares/authMiddleware");
const settingsController = new SettingsController();

const router = express.Router();

// ==========================
// Các route đặc biệt / cụ thể (đặt trước để tránh conflict với :userId)
// ==========================

// Reset toàn bộ settings về mặc định cho user
router.post("/:userId/reset", (req, res) =>
  settingsController.resetSettings(req, res)
);

// Toggle nhanh notification
router.patch("/:userId/notifications", (req, res) =>
  settingsController.updateNotifications(req, res)
);

// Change theme riêng
router.patch("/:userId/theme", (req, res) =>
  settingsController.updateTheme(req, res)
);

// Change language riêng
router.patch("/:userId/language", (req, res) =>
  settingsController.updateLanguage(req, res)
);

// ==========================
// CRUD chuẩn cho settings
// ==========================
router.get("/", (req, res) => settingsController.getAllSettings(req, res));
router.get("/:userId", (req, res) =>
  settingsController.getSettingsByUserId(req, res)
);
router.post("/", authenticateToken, (req, res) =>
  settingsController.createSettings(req, res)
);
router.put("/:userId", (req, res) =>
  settingsController.updateSettings(req, res)
);
// router.delete("/:userId", (req, res) =>
//   settingsController.deleteSettings(req, res)
// );

module.exports = router;
