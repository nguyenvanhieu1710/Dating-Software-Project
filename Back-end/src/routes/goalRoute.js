const express = require('express');
const router = express.Router();
const GoalController = require('../app/controllers/goalController');

// Specific routes (phải đặt trước parameter routes)
router.get("/search", (req, res) =>
  GoalController.searchGoals(req, res)
);
// CRUD routes
router.get("/", (req, res) => GoalController.getAllGoals(req, res));
router.get("/:id", (req, res) => GoalController.getById(req, res));
router.post("/", (req, res) => GoalController.createGoal(req, res));
router.put("/:id", (req, res) => GoalController.updateGoal(req, res));
// Not implemented
// router.delete("/:id", (req, res) => GoalController.deleteGoal(req, res));

module.exports = router;
