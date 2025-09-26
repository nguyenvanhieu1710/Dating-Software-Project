const express = require("express");
const ModerationActionsController = require("../app/controllers/ModerationActionsController");
const { authenticateToken } = require("../app/middlewares/authMiddleware");
const moderationActionsController = new ModerationActionsController();

const router = express.Router();

// Specific routes
router.get("/report/:report_id", authenticateToken, (req, res) =>
  moderationActionsController.getByReportId(req, res)
);
router.post("/execute", authenticateToken, (req, res) =>
  moderationActionsController.executeAction(req, res)
);

// CRUD routes
router.get("/", authenticateToken, (req, res) => moderationActionsController.getAll(req, res));
router.get("/:id", authenticateToken, (req, res) => moderationActionsController.getById(req, res));
router.post("/", authenticateToken, (req, res) => moderationActionsController.create(req, res));
router.put("/:id", authenticateToken, (req, res) => moderationActionsController.update(req, res));
router.delete("/:id", authenticateToken, (req, res) => moderationActionsController.delete(req, res));

module.exports = router;