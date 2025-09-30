const express = require("express");
const ModerationController = require("../app/controllers/moderationController");
const { authenticateToken } = require("../app/middlewares/authMiddleware");

const router = express.Router();
const moderationController = new ModerationController();

// Base path: /moderation

// Moderation Reports Routes
router.get("/reports", authenticateToken, (req, res) => 
  moderationController.getAll(req, res)
);
router.get("/reports/pending", authenticateToken, (req, res) => 
  moderationController.getPendingReports(req, res)
);
router.get("/reports/user/:user_id", authenticateToken, (req, res) => 
  moderationController.getByUserId(req, res)
);
router.get("/reports/:id", authenticateToken, (req, res) => 
  moderationController.getById(req, res)
);
router.post("/reports", authenticateToken, (req, res) => 
  moderationController.create(req, res)
);
router.put("/reports/:id", authenticateToken, (req, res) => 
  moderationController.update(req, res)
);
router.delete("/reports/:id", authenticateToken, (req, res) => 
  moderationController.delete(req, res)
);

// Moderation Actions Routes
router.get("/actions", authenticateToken, (req, res) => 
  moderationController.getAll(req, res)
);
router.get("/actions/report/:report_id", authenticateToken, (req, res) => 
  moderationController.getByReportId(req, res)
);
router.get("/actions/:id", authenticateToken, (req, res) => 
  moderationController.getById(req, res)
);
router.post("/actions", authenticateToken, (req, res) => 
  moderationController.create(req, res)
);
router.post("/actions/execute", authenticateToken, (req, res) => 
  moderationController.executeAction(req, res)
);
router.put("/actions/:id", authenticateToken, (req, res) => 
  moderationController.update(req, res)
);
router.delete("/actions/:id", authenticateToken, (req, res) => 
  moderationController.delete(req, res)
);

module.exports = router;