// src/routes/subscription.js
const express = require("express");
const SubscriptionController = require("../app/controllers/subscriptionController");
const subscriptionController = new SubscriptionController();

const router = express.Router();

// ==========================
// Các route đặc biệt (cụ thể)
// ==========================
router.get("/stats", (req, res) =>
  subscriptionController.getSubscriptionStats(req, res)
);

// ==========================
// Các route theo user
// ==========================
router.get("/users/:userId/subscriptions/current", (req, res) =>
  subscriptionController.getCurrentSubscription(req, res)
);

router.get("/users/:userId/subscriptions/check", (req, res) =>
  subscriptionController.checkActiveSubscription(req, res)
);

router.get("/users/:userId/subscriptions", (req, res) =>
  subscriptionController.getSubscriptionsByUserId(req, res)
);

// ==========================
// CRUD chuẩn cho subscriptions
// ==========================
router.get("/", (req, res) =>
  subscriptionController.getAllSubscriptions(req, res)
);

router.post("/", (req, res) =>
  subscriptionController.createSubscription(req, res)
);

router.get("/:subscriptionId", (req, res) =>
  subscriptionController.getSubscriptionById(req, res)
);

router.put("/:subscriptionId", (req, res) =>
  subscriptionController.updateSubscription(req, res)
);

router.delete("/:subscriptionId", (req, res) =>
  subscriptionController.cancelSubscription(req, res)
);

module.exports = router;
