const express = require("express");
const SwipeController = require("../app/controllers/swipeController");
const { authenticateToken } = require("../app/middlewares/authMiddleware");
const swipeController = new SwipeController();

const router = express.Router();

// Swipe routes
router.post("/", authenticateToken, (req, res) => swipeController.performSwipe(req, res));
router.get("/all", authenticateToken, (req, res) => swipeController.getAllSwipes(req, res));
router.get("/by-user/:userId/swiped", authenticateToken, (req, res) => swipeController.getSwipedUsers(req, res));
router.get("/by-user/:userId/swiped-by", authenticateToken, (req, res) => swipeController.getSwipedByUsers(req, res));
router.get("/by-user/:userId/stats", authenticateToken, (req, res) => swipeController.getSwipeStats(req, res));
router.delete("/:swiperUserId/:swipedUserId", authenticateToken, (req, res) => swipeController.undoSwipe(req, res));
router.get("/by-user/:userId/potential-matches", authenticateToken, (req, res) => swipeController.getPotentialMatches(req, res));

module.exports = router;