const express = require("express");
const router = express.Router();
const interestController = require("../app/controllers/interestController");

// Specific routes (phải đặt trước parameter routes)
router.get("/search", (req, res) =>
  interestController.searchInterests(req, res)
);
// CRUD routes
router.get("/", (req, res) => interestController.getAllInterests(req, res));
router.get("/:id", (req, res) => interestController.getById(req, res));
router.post("/", (req, res) => interestController.createInterest(req, res));
router.put("/:id", (req, res) => interestController.updateInterest(req, res));
// Not implemented
// router.delete("/:id", (req, res) => interestController.deleteInterest(req, res));

module.exports = router;
