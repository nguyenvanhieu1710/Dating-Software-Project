const BaseController = require("./BaseController");
const SettingsModel = require("../models/settingsModel");

class SettingsController extends BaseController {
  constructor() {
    super(new SettingsModel());
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
      // Lấy userId từ JWT token (được set bởi auth middleware)
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      // Thêm user_id vào request body từ JWT token
      const settingsData = {
        ...req.body,
        user_id: userId
      };

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
   * Tạo hoặc cập nhật settings
   */
  async upsertSettings(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const settings = await this.model.upsertSettings(userId, req.body);

      res.json({
        success: true,
        data: settings,
        message: "Settings saved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to save settings");
    }
  }

  /**
   * Cập nhật discoverable status
   */
  async updateDiscoverableStatus(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      this.validateRequiredFields(req, ["is_discoverable"]);

      const settings = await this.model.updateSettings(userId, {
        is_discoverable: req.body.is_discoverable
      });

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Settings not found",
        });
      }

      res.json({
        success: true,
        data: settings,
        message: "Discoverable status updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update discoverable status");
    }
  }

  /**
   * Cập nhật khoảng cách tìm kiếm
   */
  async updateSearchDistance(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      this.validateRequiredFields(req, ["max_distance_km"]);

      const settings = await this.model.updateSettings(userId, {
        max_distance_km: req.body.max_distance_km
      });

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Settings not found",
        });
      }

      res.json({
        success: true,
        data: settings,
        message: "Search distance updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update search distance");
    }
  }

  /**
   * Cập nhật độ tuổi tìm kiếm
   */
  async updateAgeRange(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      this.validateRequiredFields(req, ["min_age", "max_age"]);

      const settings = await this.model.updateSettings(userId, {
        min_age: req.body.min_age,
        max_age: req.body.max_age
      });

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Settings not found",
        });
      }

      res.json({
        success: true,
        data: settings,
        message: "Age range updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update age range");
    }
  }

  /**
   * Cập nhật giới tính ưa thích
   */
  async updatePreferredGender(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      this.validateRequiredFields(req, ["preferred_gender"]);

      const settings = await this.model.updateSettings(userId, {
        preferred_gender: req.body.preferred_gender
      });

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Settings not found",
        });
      }

      res.json({
        success: true,
        data: settings,
        message: "Preferred gender updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update preferred gender");
    }
  }
}

module.exports = SettingsController; 