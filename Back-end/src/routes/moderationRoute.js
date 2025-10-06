const express = require("express");
const ModerationController = require("../app/controllers/moderationController");
const { authenticateToken } = require("../app/middlewares/authMiddleware");

const router = express.Router();
const moderationController = new ModerationController();

// Base path: /moderation

// Moderation Reports Routes
router.get("/reports", (req, res) => moderationController.getAll(req, res));
router.get("/reports/pending", (req, res) =>
  moderationController.getPendingReports(req, res)
);
router.get("/reports/user/:user_id", (req, res) =>
  moderationController.getByUserId(req, res)
);
router.get("/reports/:id", (req, res) =>
  moderationController.getById(req, res)
);
router.post("/reports", (req, res) => moderationController.create(req, res));
router.put("/reports/:id", (req, res) => moderationController.update(req, res));
// Not using delete report
// router.delete("/reports/:id", (req, res) =>
//   moderationController.delete(req, res)
// );

// Moderation Actions Routes
router.get("/actions", (req, res) => moderationController.getAll(req, res));
router.get("/actions/report/:report_id", (req, res) =>
  moderationController.getByReportId(req, res)
);
router.get("/actions/:id", (req, res) =>
  moderationController.getById(req, res)
);
router.post("/actions", (req, res) => moderationController.create(req, res));
router.post("/actions/execute", (req, res) =>
  moderationController.executeAction(req, res)
);
router.put("/actions/:id", (req, res) => moderationController.update(req, res));
router.delete("/actions/:id", (req, res) =>
  moderationController.delete(req, res)
);

module.exports = router;
