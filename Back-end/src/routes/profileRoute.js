const express = require("express");
const ProfileController = require("../app/controllers/profileController");
const profileController = new ProfileController();

const router = express.Router();

// Profile routes
router.get("/by-user/:userId", (req, res) =>
  profileController.getProfileByUserId(req, res)
);
// router.post("/", (req, res) => profileController.createProfile(req, res));
router.put("/by-user/:userId", (req, res) =>
  profileController.updateProfile(req, res)
);
router.get("/search", (req, res) => profileController.searchProfiles(req, res));
router.put("/by-user/:userId/last-active", (req, res) =>
  profileController.updateLastActive(req, res)
);

module.exports = router;
