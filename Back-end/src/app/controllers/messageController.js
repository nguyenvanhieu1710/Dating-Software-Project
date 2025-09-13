const BaseController = require("./BaseController");
const MessageModel = require("../models/messageModel");
const redisManager = require("../../config/redis");

class MessageController extends BaseController {
  constructor() {
    super(new MessageModel());
    this.socketManager = null;
  }

  setSocketManager(socketManager) {
    this.socketManager = socketManager;
  }

  /**
   * Gửi tin nhắn mới với real-time broadcast
   */
  async sendMessage(req, res) {
    try {
      this.validateRequiredFields(req, ["match_id", "content"]);

      const { match_id, content, message_type = "text" } = req.body;
      const sender_id = req.user.id;

      // Validate match exists and user is part of it
      const match = await this.validateUserInMatch(match_id, sender_id);
      if (!match) {
        return res.status(403).json({
          success: false,
          message: "You are not part of this match"
        });
      }

      // Create message data
      const messageData = {
        match_id,
        sender_id,
        content,
        message_type
      };

      // Save to database
      const message = await this.model.sendMessage(messageData);

      // Get sender profile for response
      const senderProfile = await this.getSenderProfile(sender_id);

      // Prepare response data
      const responseData = {
        ...message,
        sender: senderProfile
      };

      // Broadcast to match room via Socket.io
      if (this.socketManager) {
        this.socketManager.broadcastMessage(match_id, responseData);
      }

      // Invalidate cache
      await redisManager.invalidateMessageCache(match_id);

      // Send push notification to other user
      const otherUserId = match.user1_id === sender_id ? match.user2_id : match.user1_id;
      await this.sendPushNotification(otherUserId, {
        title: senderProfile.first_name,
        body: content,
        data: { match_id, message_id: message.id }
      });

      res.status(201).json({
        success: true,
        data: responseData,
        message: "Message sent successfully"
      });

    } catch (error) {
      this.handleError(res, error, "Failed to send message");
    }
  }

  /**
   * Lấy tin nhắn của match với caching
   */
  async getMessagesByMatchId(req, res) {
    try {
      const { match_id } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      const userId = req.user.id;

      // Validate user is part of match
      const match = await this.validateUserInMatch(match_id, userId);
      if (!match) {
        return res.status(403).json({
          success: false,
          message: "You are not part of this match"
        });
      }

      // Try to get from cache first
      let messages = await redisManager.getCachedMessages(match_id);
      
      if (!messages) {
        // Get from database
        messages = await this.model.getMessagesByMatchId(match_id, userId, limit, offset);
        
        // Cache the result
        await redisManager.cacheMessages(match_id, messages);
      }

      // Mark messages as read
      await this.model.markAllAsRead(match_id, userId);

      res.json({
        success: true,
        data: messages,
        message: "Messages retrieved successfully"
      });

    } catch (error) {
      this.handleError(res, error, "Failed to retrieve messages");
    }
  }

  /**
   * Lấy tin nhắn cuối cùng của tất cả matches
   */
  async getLastMessages(req, res) {
    try {
      const userId = req.user.id;
      const messages = await this.model.getLastMessagesByUserId(userId);

      res.json({
        success: true,
        data: messages,
        message: "Last messages retrieved successfully"
      });

    } catch (error) {
      this.handleError(res, error, "Failed to retrieve last messages");
    }
  }

  /**
   * Đếm tin nhắn chưa đọc
   */
  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const unreadCounts = await this.model.countUnreadMessages(userId);

      res.json({
        success: true,
        data: unreadCounts,
        message: "Unread counts retrieved successfully"
      });

    } catch (error) {
      this.handleError(res, error, "Failed to retrieve unread counts");
    }
  }

  /**
   * Đánh dấu tin nhắn đã đọc
   */
  async markAsRead(req, res) {
    try {
      const { message_id } = req.params;
      const userId = req.user.id;

      const result = await this.model.markAsRead(message_id, userId);

      res.json({
        success: true,
        message: "Message marked as read"
      });

    } catch (error) {
      this.handleError(res, error, "Failed to mark message as read");
    }
  }

  /**
   * Xóa tin nhắn
   */
  async deleteMessage(req, res) {
    try {
      const { message_id } = req.params;
      const userId = req.user.id;

      const deleted = await this.model.deleteMessage(message_id, userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Message not found or you don't have permission to delete it"
        });
      }

      // Broadcast deletion to match room
      if (this.socketManager) {
        this.socketManager.broadcastMessage(match_id, {
          type: 'message_deleted',
          message_id: message_id
        });
      }

      res.json({
        success: true,
        message: "Message deleted successfully"
      });

    } catch (error) {
      this.handleError(res, error, "Failed to delete message");
    }
  }

  /**
   * Tìm kiếm tin nhắn
   */
  async searchMessages(req, res) {
    try {
      const { match_id } = req.params;
      const { keyword } = req.query;
      const userId = req.user.id;

      if (!keyword) {
        return res.status(400).json({
          success: false,
          message: "Search keyword is required"
        });
      }

      // Validate user is part of match
      const match = await this.validateUserInMatch(match_id, userId);
      if (!match) {
        return res.status(403).json({
          success: false,
          message: "You are not part of this match"
        });
      }

      const messages = await this.model.searchMessages(match_id, keyword);

      res.json({
        success: true,
        data: messages,
        message: "Search completed successfully"
      });

    } catch (error) {
      this.handleError(res, error, "Failed to search messages");
    }
  }

  /**
   * Lấy thống kê tin nhắn
   */
  async getMessageStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await this.model.getMessageStats(userId);

      res.json({
        success: true,
        data: stats,
        message: "Message statistics retrieved successfully"
      });

    } catch (error) {
      this.handleError(res, error, "Failed to retrieve message statistics");
    }
  }

  // Helper methods
  async validateUserInMatch(matchId, userId) {
    const sql = `
      SELECT * FROM matches 
      WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)
    `;
    const DatabaseHelper = require("../../config/database/queryHelper");
    return await DatabaseHelper.getOne(sql, [matchId, userId]);
  }

  async getSenderProfile(userId) {
    const sql = `
      SELECT user_id, first_name, dob, gender 
      FROM profiles 
      WHERE user_id = $1
    `;
    const DatabaseHelper = require("../../config/database/queryHelper");
    return await DatabaseHelper.getOne(sql, [userId]);
  }

  async sendPushNotification(userId, notificationData) {
    // Implementation for push notifications
    // This would integrate with FCM, APNS, or other push services
    console.log(`Sending push notification to user ${userId}:`, notificationData);
  }
}

module.exports = MessageController; 