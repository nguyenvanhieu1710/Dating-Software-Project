const express = require("express");
const UserController = require("../app/controllers/UserController");
const { authenticateToken } = require("../app/middlewares/authMiddleware");
const userController = new UserController();

const router = express.Router();

// Specific routes (phải đặt trước parameter routes)
router.get("/me", authenticateToken, (req, res) => userController.getCurrentUser(req, res));
router.get("/with-profiles", (req, res) =>
  userController.getAllWithProfiles(req, res)
);
router.get("/by-email/:email", (req, res) => userController.findByEmail(req, res));

// Authentication routes
router.post("/login", (req, res) => userController.login(req, res));
router.post("/register", (req, res) => userController.register(req, res));
router.post("/reset-password", (req, res) => userController.resetPassword(req, res));

// CRUD routes
router.get("/", (req, res) => userController.getAll(req, res));
router.post("/", (req, res) => userController.create(req, res));
router.post("/with-profile", (req, res) =>
  userController.createWithProfile(req, res)
);

// Parameter routes (phải đặt sau specific routes)
router.get("/:id", (req, res) => userController.getById(req, res));
router.put("/:id", (req, res) => userController.update(req, res));
router.delete("/:id", (req, res) => userController.delete(req, res));
router.put("/:userId/verify", (req, res) => userController.verifyAccount(req, res));
router.put("/:userId/change-password", (req, res) => userController.changePassword(req, res));

module.exports = router;
