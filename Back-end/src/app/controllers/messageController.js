const BaseController = require("./BaseController");
const MessageModel = require("../models/messageModel");
const MatchModel = require("../models/matchModel");

class MessageController extends BaseController {
  constructor() {
    super(new MessageModel());
    this.matchModel = new MatchModel();
  }

  /**
   * Kiểm tra xem user có thuộc match không
   * @param {number} matchId - ID của match cần kiểm tra
   * @param {number} userId - ID của user cần xác thực
   * @returns {Promise<object|null>} Trả về thông tin match nếu user thuộc match, ngược lại trả về null
   */
  async validateUserInMatch(matchId, userId) {
    try {
      // Lấy thông tin match từ database
      const match = await this.matchModel.getMatchById(matchId, userId);

      // Nếu không tìm thấy match
      if (!match) {
        return null;
      }

      // Kiểm tra user có phải là user1 hoặc user2 trong match không
      if (match.user1_id === userId || match.user2_id === userId) {
        return match;
      }

      return null;
    } catch (error) {
      console.error("Lỗi khi xác thực user trong match:", error);
      return null;
    }
  }

  // ================================
  // CRUD cơ bản cho messages
  // ================================

  async createMessage(req, res) {
    try {
      this.validateRequiredFields(req, ["match_id", "content"]);
      const { match_id, content, message_type = "text" } = req.body;
      const sender_id = req.user?.id || req.user?.userId;

      if (!sender_id) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      const match = await this.validateUserInMatch(match_id, sender_id);
      if (!match) {
        return res
          .status(403)
          .json({ success: false, message: "You are not part of this match" });
      }

      const messageData = { match_id, sender_id, content, message_type };
      const message = await this.model.createMessage(messageData);
      const senderProfile = await this.getSenderProfile(sender_id);

      const responseData = { ...message, sender: senderProfile };

      if (this.socketManager) {
        try {
          this.socketManager.broadcastMessage(match_id, responseData);
        } catch (error) {
          console.error("Error broadcasting message:", error);
        }
      }

      res.status(201).json({
        success: true,
        data: responseData,
        message: "Message created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create message");
    }
  }

  /**
   * Lấy thông tin người gửi tin nhắn
   * @param {number} userId - ID của người gửi
   * @returns {Promise<object>} Thông tin người gửi
   */
  async getSenderProfile(userId) {
    try {
      const userModel = require("../models/userModel");
      const user = await userModel.getUserById(userId);

      if (!user) {
        return { id: userId, name: "Người dùng ẩn danh" };
      }

      // Trả về các thông tin cần thiết cho tin nhắn
      return {
        id: user.id,
        name: user.name || user.username || `User ${userId}`,
        avatar: user.avatar || null,
      };
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người gửi:", error);
      return {
        id: userId,
        name: `User ${userId}`,
        avatar: null,
      };
    }
  }

  /**
   * get all messages
   */
  async getAllMessages(req, res) {
    try {
      const { matchId, limit = 50, offset = 0 } = req.query;
      const userId = req.user.userId;
      const messages = await this.model.getAllMessages(userId, {
        matchId,
        limit,
        offset,
      });
      res.json({
        success: true,
        data: messages,
        message: "Messages retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get messages");
    }
  }

  async getMessageById(req, res) {
    try {
      const { messageId } = req.params;
      const message = await this.model.getMessageById(messageId);
      if (!message) {
        return res
          .status(404)
          .json({ success: false, message: "Message not found" });
      }
      res.json({
        success: true,
        data: message,
        message: "Message retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get message");
    }
  }

  async updateMessage(req, res) {
    try {
      const { messageId } = req.params;
      const userId = req.user.userId;
      const message = await this.model.updateMessage(
        messageId,
        userId,
        req.body
      );
      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found or not owned by user",
        });
      }
      res.json({
        success: true,
        data: message,
        message: "Message updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update message");
    }
  }

  async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;
      const userId = req.user.userId;
      const deleted = await this.model.deleteMessage(messageId, userId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Message not found or no permission to delete",
        });
      }
      res.json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
      this.handleError(res, error, "Failed to delete message");
    }
  }

  // ================================
  // Routes phụ trợ
  // ================================

  async getMessagesByMatchId(req, res) {
    try {
      const { matchId } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      const userId = req.user.userId;

      const match = await this.validateUserInMatch(matchId, userId);
      if (!match)
        return res
          .status(403)
          .json({ success: false, message: "Not part of this match" });

      const messages = await this.model.getMessagesByMatchId(
        matchId,
        userId,
        limit,
        offset
      );
      res.json({
        success: true,
        data: messages,
        message: "Messages retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve messages");
    }
  }

  async markAllAsRead(req, res) {
    try {
      const { matchId } = req.params;
      const userId = req.user.userId;
      await this.model.markAllAsRead(matchId, userId);
      res.json({ success: true, message: "All messages marked as read" });
    } catch (error) {
      this.handleError(res, error, "Failed to mark all as read");
    }
  }

  async markAsRead(req, res) {
    try {
      const { messageId } = req.params;
      const userId = req.user.userId;
      await this.model.markAsRead(messageId, userId);
      res.json({ success: true, message: "Message marked as read" });
    } catch (error) {
      this.handleError(res, error, "Failed to mark message as read");
    }
  }

  async getLastMessages(req, res) {
    try {
      const userId = req.user.userId;
      const messages = await this.model.getLastMessagesByUserId(userId);
      res.json({
        success: true,
        data: messages,
        message: "Last messages retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get last messages");
    }
  }

  async getUnreadCount(req, res) {
    try {
      const userId = req.user.userId;
      const count = await this.model.countUnreadMessages(userId);
      res.json({
        success: true,
        data: count,
        message: "Unread count retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get unread count");
    }
  }

  // ================================
  // Reactions & Attachments
  // ================================

  async addReaction(req, res) {
    try {
      const { messageId } = req.params;
      const userId = req.user.userId;
      this.validateRequiredFields(req, ["reaction_type"]);
      const reaction = await this.model.addReaction(
        messageId,
        userId,
        req.body.reaction_type
      );
      res
        .status(201)
        .json({ success: true, data: reaction, message: "Reaction added" });
    } catch (error) {
      this.handleError(res, error, "Failed to add reaction");
    }
  }

  async removeReaction(req, res) {
    try {
      const { messageId, reactionId } = req.params;
      const userId = req.user.userId;
      await this.model.removeReaction(messageId, reactionId, userId);
      res.json({ success: true, message: "Reaction removed" });
    } catch (error) {
      this.handleError(res, error, "Failed to remove reaction");
    }
  }

  async addAttachment(req, res) {
    try {
      const { messageId } = req.params;
      this.validateRequiredFields(req, ["file_url", "file_type"]);
      const { file_url, file_type, metadata } = req.body;
      const attachment = await this.model.addAttachment(
        messageId,
        file_url,
        file_type,
        metadata
      );
      res
        .status(201)
        .json({ success: true, data: attachment, message: "Attachment added" });
    } catch (error) {
      this.handleError(res, error, "Failed to add attachment");
    }
  }

  async removeAttachment(req, res) {
    try {
      const { messageId, attachmentId } = req.params;
      await this.model.removeAttachment(messageId, attachmentId);
      res.json({ success: true, message: "Attachment removed" });
    } catch (error) {
      this.handleError(res, error, "Failed to remove attachment");
    }
  }
}

module.exports = MessageController;
