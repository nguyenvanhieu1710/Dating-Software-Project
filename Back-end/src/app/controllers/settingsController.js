const BaseController = require("./BaseController");
const SettingsModel = require("../models/settingsModel");

class SettingsController extends BaseController {
  constructor() {
    super(new SettingsModel());
  }

  /**
   * Get all setting of user
   */
  async getAllSettings(req, res){
    try {
      const settings = await this.model.getAllSettings();
      res.json({
        success: true,
        data: settings,
        message: "Settings retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get settings");
    }
  }

  /**
   * Lấy settings của user
   */
  async getSettingsByUserId(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const settings = await this.model.findByUserId(userId);

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Settings not found",
        });
      }

      res.json({
        success: true,
        data: settings,
        message: "Settings retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get settings");
    }
  }

  /**
   * Tạo settings mới
   */
  async createSettings(req, res) {
    try {
      const settingsData = req.body;
      console.log(settingsData);      
      const settings = await this.model.createSettings(settingsData);

      res.status(201).json({
        success: true,
        data: settings,
        message: "Settings created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create settings");
    }
  }

  /**
   * Cập nhật settings
   */
  async updateSettings(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const settings = await this.model.updateSettings(userId, req.body);

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Settings not found",
        });
      }

      res.json({
        success: true,
        data: settings,
        message: "Settings updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update settings");
    }
  }

  /**
   * Cập nhật ngôn ngữ
   */
  async updateLanguage(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);
  
      this.validateRequiredFields(req, ["language"]);
  
      const settings = await this.model.updateSettings(userId, {
        language: req.body.language
      });
  
      res.json({
        success: true,
        data: settings,
        message: "Language updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update language");
    }
  }  

  /**
   * Cập nhật theme
   */
  async updateTheme(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);
  
      this.validateRequiredFields(req, ["theme"]);
  
      const settings = await this.model.updateSettings(userId, {
        theme: req.body.theme
      });
  
      res.json({
        success: true,
        data: settings,
        message: "Theme updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update theme");
    }
  }
  
  /**
   * Cập nhật thông báo
   */
  async updateNotifications(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);
  
      const allowedFields = [
        "new_matches_notification",
        "new_messages_notification",
        "message_likes_notification",
        "message_super_likes_notification",
        "profile_views_notification",
        "email_notifications",
        "push_notifications",
        "promotional_emails"
      ];
  
      const updateData = {};
      for (const field of allowedFields) {
        if (field in req.body) updateData[field] = req.body[field];
      }
  
      const settings = await this.model.updateSettings(userId, updateData);
  
      res.json({
        success: true,
        data: settings,
        message: "Notifications updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update notifications");
    }
  }
  
  /**
   * Reset settings về mặc định
   */
  async resetSettings(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);
  
      const settings = await this.model.resetToDefault(userId);
  
      res.json({
        success: true,
        data: settings,
        message: "Settings reset to default successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to reset settings");
    }
  }
  
}

module.exports = SettingsController; 