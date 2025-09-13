const express = require("express");
const SubscriptionController = require("../app/controllers/subscriptionController");
const subscriptionController = new SubscriptionController();

const router = express.Router();

// Subscription routes
router.get("/by-user/:userId/current", (req, res) => subscriptionController.getCurrentSubscription(req, res));
router.get("/by-user/:userId", (req, res) => subscriptionController.getSubscriptionsByUserId(req, res));
router.post("/", (req, res) => subscriptionController.createSubscription(req, res));
router.put("/:subscriptionId/status", (req, res) => subscriptionController.updateSubscriptionStatus(req, res));
router.put("/:subscriptionId/by-user/:userId/cancel", (req, res) => subscriptionController.cancelSubscription(req, res));
router.get("/by-user/:userId/check", (req, res) => subscriptionController.checkActiveSubscription(req, res));
router.get("/stats", (req, res) => subscriptionController.getSubscriptionStats(req, res));
router.get("/expiring", (req, res) => subscriptionController.getExpiringSubscriptions(req, res));
router.put("/:subscriptionId/renew", (req, res) => subscriptionController.renewSubscription(req, res));

module.exports = router; 