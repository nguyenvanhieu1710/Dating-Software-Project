const BaseController = require("./BaseController");
const NotificationModel = require("../models/notificationModel");

class NotificationsController extends BaseController {
  constructor() {
    super(new NotificationModel());
  }

  /**
   * Lấy tất cả thông báo của một user
   */
  async getByUserId(req, res) {
    try {
      const { user_id } = req.params;
      this.validateId(user_id);
      // console.log("user_id: ", user_id);

      const { page = 1, limit = 20, type } = req.query;
      const filters = {};
      if (type) filters.type = type;

      const notifications = await this.model.findByUserId(user_id, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        filters,
      });

      res.json({
        success: true,
        data: notifications,
        message: "Notifications retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve notifications for user");
    }
  }

  /**
   * Đánh dấu tất cả thông báo của user là đã đọc
   */
  async markAllAsRead(req, res) {
    try {
      // Lấy userId từ JWT token
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      await this.model.markAllAsRead(userId);

      res.json({
        success: true,
        message: "All notifications marked as read successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to mark all notifications as read");
    }
  }

  /**
   * Lấy tất cả thông báo (admin-only)
   */
  async getAll(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const notifications = await this.model.findAll({
        page: parseInt(page),
        limit: parseInt(limit),
      });

      res.json({
        success: true,
        data: notifications,
        message: "All notifications retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve all notifications");
    }
  }

  /**
   * Lấy thông báo theo ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const notification = await this.model.findById(id);
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      // Kiểm tra quyền truy cập: chỉ user sở hữu hoặc admin
      const currentUserId = req.user?.userId;
      if (notification.user_id !== currentUserId && !req.user?.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to view this notification",
        });
      }

      res.json({
        success: true,
        data: notification,
        message: "Notification retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve notification by ID");
    }
  }

  /**
   * Tạo thông báo mới
   */
  async create(req, res) {
    try {
      this.validateRequiredFields(req, ["user_id", "title", "body"]);

      const { user_id, title, body, data } = req.body;
      this.validateId(user_id);

      const notificationData = {
        user_id,
        title,
        body,
        data,
        sent_at: new Date(),
        read_at: null,
        created_at: new Date(),
      };

      const notification = await this.model.create(notificationData);

      res.status(201).json({
        success: true,
        data: notification,
        message: "Notification created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create notification");
    }
  }

  /**
   * Xóa thông báo (soft delete)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const notification = await this.model.findById(id);
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      // Kiểm tra quyền truy cập: chỉ user sở hữu hoặc admin
      const currentUserId = req.user?.userId;
      if (notification.user_id !== currentUserId && !req.user?.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to delete this notification",
        });
      }

      await this.model.delete(id);

      res.json({
        success: true,
        message: "Notification deleted successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to delete notification");
    }
  }
}

module.exports = NotificationsController;
