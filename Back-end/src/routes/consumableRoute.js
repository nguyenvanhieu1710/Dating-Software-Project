const express = require("express");
const ConsumableController = require("../app/controllers/consumableController");
const consumableController = new ConsumableController();

const router = express.Router();

// Consumable routes
router.get("/by-user/:userId", (req, res) => consumableController.getConsumablesByUserId(req, res));
router.put("/by-user/:userId", (req, res) => consumableController.upsertConsumables(req, res));

// Super like routes
router.put("/by-user/:userId/super-like/use", (req, res) => consumableController.useSuperLike(req, res));
router.put("/by-user/:userId/super-like/add", (req, res) => consumableController.addSuperLikes(req, res));
router.get("/by-user/:userId/super-like/can-use", (req, res) => consumableController.canUseSuperLike(req, res));
router.put("/by-user/:userId/super-like/reset", (req, res) => consumableController.resetDailySuperLikes(req, res));

// Boost routes
router.put("/by-user/:userId/boost/use", (req, res) => consumableController.useBoost(req, res));
router.put("/by-user/:userId/boost/add", (req, res) => consumableController.addBoosts(req, res));
router.get("/by-user/:userId/boost/can-use", (req, res) => consumableController.canUseBoost(req, res));

// Stats
router.get("/stats", (req, res) => consumableController.getConsumableStats(req, res));

module.exports = router; 