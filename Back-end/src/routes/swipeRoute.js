const express = require("express");
const SwipeController = require("../app/controllers/swipeController");
const { authenticateToken } = require("../app/middlewares/authMiddleware");
const swipeController = new SwipeController();

const router = express.Router();

// ==========================
// Các route đặc biệt (cụ thể) - đặt trước để tránh conflict
// ==========================

// ==========================
// Các route theo user
// ==========================

// Lấy danh sách người mà user đã swipe
router.get("/users/:userId/swipes/swiped", authenticateToken, (req, res) => 
  swipeController.getSwipedUsers(req, res)
);

// Lấy danh sách người đã swipe user
router.get("/users/:userId/swipes/swiped-by", authenticateToken, (req, res) => 
  swipeController.getSwipedByUsers(req, res)
);

// Lấy thống kê swipe của user
router.get("/users/:userId/swipes/stats", authenticateToken, (req, res) => 
  swipeController.getSwipeStats(req, res)
);

// Lấy potential matches của user
router.get("/users/:userId/swipes/potential-matches", authenticateToken, (req, res) => 
  swipeController.getPotentialMatches(req, res)
);

// ==========================
// CRUD chuẩn cho swipes
// ==========================

// Lấy tất cả swipes (với pagination và filter)
router.get("/", authenticateToken, (req, res) => 
  swipeController.getAllSwipes(req, res)
);

// Tạo swipe mới (perform swipe)
router.post("/", authenticateToken, (req, res) => 
  swipeController.performSwipe(req, res)
);

// Xóa swipe (undo) - sử dụng composite key
router.delete("/:swiperUserId/:swipedUserId", authenticateToken, (req, res) => 
  swipeController.undoSwipe(req, res)
);

module.exports = router;