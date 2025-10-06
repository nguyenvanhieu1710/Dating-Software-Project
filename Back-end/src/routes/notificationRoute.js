const express = require("express");
const NotificationController = require("../app/controllers/notificationController");
const { authenticateToken } = require("../app/middlewares/authMiddleware");
const notificationController = new NotificationController();

const router = express.Router();

// Specific routes
router.get("/user/:user_id", authenticateToken, (req, res) =>
  notificationController.getByUserId(req, res)
);
router.put("/read-all", authenticateToken, (req, res) =>
  notificationController.markAllAsRead(req, res)
);

// CRUD routes
router.get("/", (req, res) => notificationController.getAll(req, res));
router.get("/:id", (req, res) => notificationController.getById(req, res));
router.post("/", (req, res) => notificationController.create(req, res));
// Not implemented
// router.delete("/:id", authenticateToken, (req, res) => notificationController.delete(req, res));

module.exports = router;