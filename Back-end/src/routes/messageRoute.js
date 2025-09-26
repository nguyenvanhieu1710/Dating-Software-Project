const express = require("express");
const MessageController = require("../app/controllers/messageController");
const { authenticateToken } = require("../app/middlewares/authMiddleware");
const messageController = new MessageController();

const router = express.Router();
router.use(authenticateToken);

// ==========================
// Các route cụ thể / bổ sung
// ==========================

// Lấy toàn bộ tin nhắn theo match
router.get("/match/:matchId", (req, res) =>
  messageController.getMessagesByMatchId(req, res)
);

// Đánh dấu tất cả tin nhắn trong match đã đọc
router.put("/match/:matchId/read", (req, res) =>
  messageController.markAllAsRead(req, res)
);

// Lấy tin nhắn cuối cùng của mỗi cuộc trò chuyện (inbox list)
router.get("/last-messages", (req, res) =>
  messageController.getLastMessages(req, res)
);

// Đếm số tin chưa đọc của user
router.get("/unread-count", (req, res) =>
  messageController.getUnreadCount(req, res)
);

// Đánh dấu 1 tin nhắn đã đọc
router.put("/:messageId/read", (req, res) =>
  messageController.markAsRead(req, res)
);

// ==========================
// CRUD chuẩn cho messages
// ==========================

// Tạo tin nhắn mới
router.post(
  "/",
  (req, res) => messageController.createMessage(req, res) // thay vì sendMessage
);

// Lấy tất cả tin nhắn (có thể filter qua query: ?matchId=123)
router.get("/", (req, res) => messageController.getAllMessages(req, res));

// Lấy chi tiết 1 tin nhắn
router.get("/:messageId", (req, res) =>
  messageController.getMessageById(req, res)
);

// Update 1 tin nhắn (ví dụ sửa nội dung)
router.put("/:messageId", (req, res) =>
  messageController.updateMessage(req, res)
);

// Xóa 1 tin nhắn
router.delete("/:messageId", (req, res) =>
  messageController.deleteMessage(req, res)
);

// ==========================
// Reactions API
// ==========================

// Thêm reaction vào tin nhắn
router.post("/:messageId/reactions", (req, res) =>
  messageController.addReaction(req, res)
);

// Xóa reaction khỏi tin nhắn
router.delete("/:messageId/reactions/:reactionId", (req, res) =>
  messageController.removeReaction(req, res)
);

// ==========================
// Attachments API
// ==========================

// Upload file đính kèm vào tin nhắn
router.post("/:messageId/attachments", (req, res) =>
  messageController.addAttachment(req, res)
);

// Xóa file đính kèm khỏi tin nhắn
router.delete("/:messageId/attachments/:attachmentId", (req, res) =>
  messageController.removeAttachment(req, res)
);

module.exports = router;
