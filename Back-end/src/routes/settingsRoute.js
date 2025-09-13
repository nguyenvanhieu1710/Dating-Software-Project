const express = require("express");
const SettingsController = require("../app/controllers/settingsController");
const { authenticateToken } = require("../app/middlewares/authMiddleware");
const settingsController = new SettingsController();

const router = express.Router();

// Settings routes
router.get("/by-user/:userId", (req, res) => settingsController.getSettingsByUserId(req, res));
router.post("/", authenticateToken, (req, res) => settingsController.createSettings(req, res));
router.put("/by-user/:userId", (req, res) => settingsController.updateSettings(req, res));
router.put("/by-user/:userId/upsert", (req, res) => settingsController.upsertSettings(req, res));

// Specific settings updates
router.put("/by-user/:userId/discoverable", (req, res) => settingsController.updateDiscoverableStatus(req, res));
router.put("/by-user/:userId/distance", (req, res) => settingsController.updateSearchDistance(req, res));
router.put("/by-user/:userId/age-range", (req, res) => settingsController.updateAgeRange(req, res));
router.put("/by-user/:userId/preferred-gender", (req, res) => settingsController.updatePreferredGender(req, res));

module.exports = router; 