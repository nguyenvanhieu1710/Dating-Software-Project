const express = require("express");
const UserController = require("../app/controllers/userController");
const { authenticateToken } = require("../app/middlewares/authMiddleware");
const userController = new UserController();

const router = express.Router();

// Specific routes (phải đặt trước parameter routes)
// api đề xuất dựa trên tất cả tiêu chí trong profile
router.get("/recommend", authenticateToken, (req, res) => {
  userController.getRecommendUsers(req, res);
});
router.get("/me", authenticateToken, (req, res) =>
  userController.getCurrentUser(req, res)
);
router.get("/search", authenticateToken, (req, res) =>
  userController.searchUsers(req, res)
);
// Verification routes
// admin xem danh sách verification
router.get("/verifications", (req, res) =>
  userController.getVerifications(req, res)
);
router.get("/verifications/:id", authenticateToken, (req, res) =>
  userController.getVerificationsById(req, res)
);
router.get("/verifications/:user_id", authenticateToken, (req, res) =>
  userController.getVerificationsByUserId(req, res)
);
// admin xác minh và không xác minh
router.put("/verifications/:id", authenticateToken, (req, res) =>
  userController.updateVerification(req, res)
);
// Block routes
// get all block
router.get("/blocks", (req, res) =>
  userController.getBlocks(req, res)
);
// 1 người block 1 người
router.post("/blocks", authenticateToken, (req, res) =>
  userController.blockUser(req, res)
);
// 1 người unblock 1 người
router.delete("/blocks/:blocked_id", authenticateToken, (req, res) =>
  userController.unblockUser(req, res)
);
// Device of user Routes
// Get all device
router.get("/devices", (req, res) =>
  userController.getDevices(req, res)
);
// Đăng ký thiết bị mới (khi login)
router.post("/devices", (req, res) =>
  userController.registerDevice(req, res)
);
// Lấy danh sách thiết bị của mình
router.get("/devices", authenticateToken, (req, res) =>
  userController.getMyDevices(req, res)
);
// Cập nhật thông tin thiết bị
router.put("/devices/:id", (req, res) =>
  userController.updateDevice(req, res)
);
// lấy danh sách user theo interest
router.get("/interests", authenticateToken, (req, res) =>
  userController.getUsersByInterest(req, res)
);
// lấy danh sách user theo goal
router.get("/goals", authenticateToken, (req, res) =>
  userController.getUsersByGoal(req, res)
);
// CRUD routes with profile
router.get("/", (req, res) => userController.getAllWithProfiles(req, res));
router.get("/:id", (req, res) => userController.getByIdWithProfile(req, res));
router.post("/", (req, res) => userController.createWithProfile(req, res));
router.put("/:id", (req, res) => userController.updateWithProfile(req, res));
router.delete("/:id", (req, res) => userController.deleteWithProfile(req, res));

module.exports = router;
