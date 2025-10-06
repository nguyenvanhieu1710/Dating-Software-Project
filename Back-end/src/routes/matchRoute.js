const express = require("express");
const MatchController = require("../app/controllers/matchController");
// const { authenticateToken } = require('../app/middlewares/authMiddleware');
const matchController = new MatchController();

const router = express.Router();

// Apply authentication middleware to all match routes
// router.use(authenticateToken);

// ========== MATCHES Route New ==========
// Danh sách tất cả matches của 1 user
router.get("/users/:userId/matches", (req, res) =>
  matchController.getMatchesByUserId(req, res)
);

// Thống kê match của user
router.get("/users/:userId/matches/stats", (req, res) =>
  matchController.getMatchStats(req, res)
);

// Chi tiết 1 match (theo matchId)
router.get("/users/:userId/matches/:matchId", (req, res) =>
  matchController.getMatchById(req, res)
);

// Unmatch
router.delete("/users/:userId/matches/:matchId", (req, res) =>
  matchController.unmatch(req, res)
);

// Check mutual match giữa 2 users
router.get("/users/:user1Id/mutual/:user2Id", (req, res) =>
  matchController.checkMutualMatch(req, res)
);

// Match routes old but still use them
router.get("/", (req, res) => matchController.getAllMatches(req, res));
router.get("/by-user/:userId", (req, res) =>
  matchController.getMatchesByUserId(req, res)
);
router.get("/:matchId/by-user/:userId", (req, res) =>
  matchController.getMatchById(req, res)
);
router.put("/:matchId/by-user/:userId/unmatch", (req, res) =>
  matchController.unmatch(req, res)
);
router.get("/by-user/:userId/stats", (req, res) =>
  matchController.getMatchStats(req, res)
);
router.get("/mutual/:user1Id/:user2Id", (req, res) =>
  matchController.checkMutualMatch(req, res)
);

module.exports = router;
