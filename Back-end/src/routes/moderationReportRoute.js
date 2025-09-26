const express = require("express");
const ModerationReportsController = require("../app/controllers/ModerationReportsController");
const { authenticateToken } = require("../app/middlewares/authMiddleware");
const moderationReportsController = new ModerationReportsController();

const router = express.Router();

// Specific routes
router.get("/pending", authenticateToken, (req, res) =>
  moderationReportsController.getPendingReports(req, res)
);
router.get("/user/:user_id", authenticateToken, (req, res) =>
  moderationReportsController.getByUserId(req, res)
);

// CRUD routes
router.get("/", authenticateToken, (req, res) => moderationReportsController.getAll(req, res));
router.get("/:id", authenticateToken, (req, res) => moderationReportsController.getById(req, res));
router.post("/", authenticateToken, (req, res) => moderationReportsController.create(req, res));
router.put("/:id", authenticateToken, (req, res) => moderationReportsController.update(req, res));
router.delete("/:id", authenticateToken, (req, res) => moderationReportsController.delete(req, res));

module.exports = router;