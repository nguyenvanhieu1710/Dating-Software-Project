const BaseController = require("./BaseController");
const ConsumableModel = require("../models/consumableModel");

class ConsumableController extends BaseController {
  constructor() {
    super(new ConsumableModel());
  }

  /**
   * Lấy consumables của user
   */
  async getConsumablesByUserId(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const consumables = await this.model.findByUserId(userId);

      if (!consumables) {
        return res.status(404).json({
          success: false,
          message: "Consumables not found",
        });
      }

      res.json({
        success: true,
        data: consumables,
        message: "Consumables retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get consumables");
    }
  }

  /**
   * Tạo hoặc cập nhật consumables
   */
  async upsertConsumables(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const consumables = await this.model.upsertConsumables(userId, req.body);

      res.json({
        success: true,
        data: consumables,
        message: "Consumables saved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to save consumables");
    }
  }

  /**
   * Sử dụng super like
   */
  async useSuperLike(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const consumables = await this.model.useSuperLike(userId);

      if (!consumables) {
        return res.status(400).json({
          success: false,
          message: "No super likes available",
        });
      }

      res.json({
        success: true,
        data: consumables,
        message: "Super like used successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to use super like");
    }
  }

  /**
   * Sử dụng boost
   */
  async useBoost(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const consumables = await this.model.useBoost(userId);

      if (!consumables) {
        return res.status(400).json({
          success: false,
          message: "No boosts available",
        });
      }

      res.json({
        success: true,
        data: consumables,
        message: "Boost used successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to use boost");
    }
  }

  /**
   * Thêm super likes
   */
  async addSuperLikes(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      this.validateRequiredFields(req, ["amount"]);

      const consumables = await this.model.addSuperLikes(userId, req.body.amount);

      res.json({
        success: true,
        data: consumables,
        message: "Super likes added successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to add super likes");
    }
  }

  /**
   * Thêm boosts
   */
  async addBoosts(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      this.validateRequiredFields(req, ["amount"]);

      const consumables = await this.model.addBoosts(userId, req.body.amount);

      res.json({
        success: true,
        data: consumables,
        message: "Boosts added successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to add boosts");
    }
  }

  /**
   * Kiểm tra có thể sử dụng super like không
   */
  async canUseSuperLike(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const canUse = await this.model.canUseSuperLike(userId);

      res.json({
        success: true,
        data: { canUseSuperLike: canUse },
        message: "Super like availability checked successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to check super like availability");
    }
  }

  /**
   * Kiểm tra có thể sử dụng boost không
   */
  async canUseBoost(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const canUse = await this.model.canUseBoost(userId);

      res.json({
        success: true,
        data: { canUseBoost: canUse },
        message: "Boost availability checked successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to check boost availability");
    }
  }

  /**
   * Reset daily super likes
   */
  async resetDailySuperLikes(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const consumables = await this.model.resetDailySuperLikes(userId);

      res.json({
        success: true,
        data: consumables,
        message: "Daily super likes reset successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to reset daily super likes");
    }
  }

  /**
   * Lấy thống kê consumables
   */
  async getConsumableStats(req, res) {
    try {
      const stats = await this.model.getConsumableStats();

      res.json({
        success: true,
        data: stats,
        message: "Consumable statistics retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get consumable statistics");
    }
  }
}

module.exports = ConsumableController; 