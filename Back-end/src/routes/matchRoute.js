const express = require("express");
const MatchController = require("../app/controllers/matchController");
// const { authenticateToken } = require('../app/middlewares/authMiddleware');
const matchController = new MatchController();

const router = express.Router();

// Apply authentication middleware to all match routes
// router.use(authenticateToken);

// Match routes
router.get("/", (req, res) => matchController.getAllMatches(req, res));
router.get("/by-user/:userId", (req, res) => matchController.getMatchesByUserId(req, res));
router.get("/:matchId/by-user/:userId", (req, res) => matchController.getMatchById(req, res));
router.put("/:matchId/by-user/:userId/unmatch", (req, res) => matchController.unmatch(req, res));
router.get("/by-user/:userId/stats", (req, res) => matchController.getMatchStats(req, res));
router.get("/mutual/:user1Id/:user2Id", (req, res) => matchController.checkMutualMatch(req, res));

module.exports = router; 