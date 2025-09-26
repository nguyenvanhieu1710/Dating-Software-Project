const BaseController = require("./BaseController");
const NotificationModel = require("../models/notificationModel");
const UserDevicesModel = require("../models/userDeviceModel");
const SettingsModel = require("../models/settingsModel");

class NotificationsController extends BaseController {
  constructor() {
    super(new NotificationModel());
  }

  /**
   * Gửi thông báo push
   * dùng cho api như bên dưới tôi mô tả nha
   */
  // {
  //   "user_id": 123,
  //   "title": "New Match!",
  //   "body": "You have a new match with Jane!",
  //   "data": { "type": "new_match" }
  // }
  async sendPushNotification(req, res) {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }

      this.validateRequiredFields(req, ["user_id", "title", "body", "data"]);

      const { user_id, title, body, data } = req.body;
      this.validateId(user_id);

      // Kiểm tra data.type
      if (!data || !data.type) {
        return res.status(400).json({
          success: false,
          message: "Field 'data.type' is required",
        });
      }

      // Danh sách các loại thông báo hợp lệ và trường cài đặt tương ứng
      const notificationTypes = {
        new_match: "new_matches_notification",
        new_message: "new_messages_notification",
        message_like: "message_likes_notification",
        message_super_like: "message_super_likes_notification",
        profile_view: "profile_views_notification",
      };

      const settings = await SettingsModel.findOne({ user_id });
      if (!settings || !settings.push_notifications) {
        return res.status(403).json({
          success: false,
          message: "User disabled notifications",
        });
      }

      // Kiểm tra cài đặt cụ thể cho loại thông báo
      const notificationTypeField = notificationTypes[data.type];
      if (!notificationTypeField || !settings[notificationTypeField]) {
        return res.status(403).json({
          success: false,
          message: `User disabled ${data.type} notifications`,
        });
      }

      const devices = await UserDevicesModel.findByUserId(user_id, {
        page: 1,
        limit: 100,
      });
      if (!devices.length) {
        return res.status(404).json({
          success: false,
          message: "No devices found for user",
        });
      }

      const notification = await this.model.create({
        user_id,
        title,
        body,
        data,
        is_read: false,
        sent_at: new Date(),
        created_at: new Date(),
      });

      // Gửi push notification qua FCM
      const FCM = require("fcm-node");
      const fcm = new FCM(process.env.FCM_SERVER_KEY);
      for (const device of devices) {
        await fcm.send({
          to: device.device_token,
          notification: { title, body },
          data: { notification_id: notification.id },
        });
      }

      res.status(201).json({
        success: true,
        data: notification,
        message: "Push notification sent successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to send push notification");
    }
  }

  /**
   * Lấy tất cả thông báo của một user
   */
  async getByUserId(req, res) {
    try {
      const { user_id } = req.params;
      this.validateId(user_id);

      // Kiểm tra quyền truy cập: chỉ user hoặc admin có thể xem
      const currentUserId = req.user?.userId;
      if (!currentUserId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      // Nếu không phải admin, chỉ cho phép xem thông báo của chính user
      if (currentUserId !== user_id && !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to view notifications of another user",
        });
      }

      const { page = 1, limit = 20, is_read, type } = req.query;
      const filters = { user_id };
      if (is_read !== undefined) filters.is_read = is_read === "true";
      if (type) filters.type = type;

      const notifications = await this.model.findByUserId(user_id, {
        page: parseInt(page),
        limit: parseInt(limit),
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
      // Kiểm tra quyền admin
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }

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
      // Kiểm tra quyền admin (hoặc internal server call)
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Admin access required to create notification",
        });
      }

      this.validateRequiredFields(req, ["user_id", "content", "type"]);

      const { user_id, content, type, is_read = false } = req.body;
      this.validateId(user_id);

      const notificationData = {
        user_id,
        content,
        type,
        is_read,
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
