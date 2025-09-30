const express = require("express");
const AdminUsersController = require("../app/controllers/adminUserController");
const { authenticateToken } = require("../app/middlewares/authMiddleware");
const adminUsersController = new AdminUsersController();

const router = express.Router();

// Specific routes (admin-only)
router.get("/me", authenticateToken, (req, res) =>
  adminUsersController.getCurrentAdmin(req, res)
);
router.get("/active", authenticateToken, (req, res) =>
  adminUsersController.getActiveAdmins(req, res)
);

// CRUD routes (admin-only)
router.get("/", authenticateToken, (req, res) => adminUsersController.getAll(req, res));
router.get("/:id", authenticateToken, (req, res) => adminUsersController.getById(req, res));
router.post("/", authenticateToken, (req, res) => adminUsersController.create(req, res));
router.put("/:id", authenticateToken, (req, res) => adminUsersController.update(req, res));
router.delete("/:id", authenticateToken, (req, res) => adminUsersController.delete(req, res));

module.exports = router;