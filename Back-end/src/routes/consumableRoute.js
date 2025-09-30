const express = require("express");
const ConsumableController = require("../app/controllers/consumableController");
const consumableController = new ConsumableController();

const router = express.Router();

// Consumable routes
router.get("/by-user/:userId", (req, res) => consumableController.getConsumablesByUserId(req, res));

// CRUD
router.get("/", (req, res) => consumableController.getAllConsumables(req, res));
router.post("/", (req, res) => consumableController.createConsumable(req, res));
router.put("/:id", (req, res) => consumableController.updateConsumable(req, res));
// Not implemented
// router.delete("/:id", (req, res) => consumableController.deleteConsumable(req, res));

module.exports = router; 