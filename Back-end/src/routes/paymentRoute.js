const express = require("express");
const PaymentsController = require("../app/controllers/paymentController");
const { authenticateToken } = require("../app/middlewares/authMiddleware");
const paymentsController = new PaymentsController();

const router = express.Router();

// Specific routes
router.get("/user/:user_id", authenticateToken, (req, res) =>
  paymentsController.getByUserId(req, res)
);
router.post("/process", authenticateToken, (req, res) =>
  paymentsController.processPayment(req, res)
);

// CRUD routes
router.get("/", authenticateToken, (req, res) => paymentsController.getAll(req, res));
router.get("/:id", authenticateToken, (req, res) => paymentsController.getById(req, res));
router.post("/", authenticateToken, (req, res) => paymentsController.create(req, res));
router.delete("/:id", authenticateToken, (req, res) => paymentsController.delete(req, res));

module.exports = router;