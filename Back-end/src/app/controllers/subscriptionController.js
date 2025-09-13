const BaseController = require("./BaseController");
const SubscriptionModel = require("../models/subscriptionModel");

class SubscriptionController extends BaseController {
  constructor() {
    super(new SubscriptionModel());
  }

  /**
   * Lấy subscription hiện tại của user
   */
  async getCurrentSubscription(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const subscription = await this.model.getCurrentSubscription(userId);

      res.json({
        success: true,
        data: subscription,
        message: "Current subscription retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get current subscription");
    }
  }

  /**
   * Lấy tất cả subscriptions của user
   */
  async getSubscriptionsByUserId(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const subscriptions = await this.model.getSubscriptionsByUserId(userId);

      res.json({
        success: true,
        data: subscriptions,
        message: "User subscriptions retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get user subscriptions");
    }
  }

  /**
   * Tạo subscription mới
   */
  async createSubscription(req, res) {
    try {
      this.validateRequiredFields(req, [
        "user_id", "plan_type", "start_date", "end_date"
      ]);

      const subscription = await this.model.createSubscription(req.body);

      res.status(201).json({
        success: true,
        data: subscription,
        message: "Subscription created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create subscription");
    }
  }

  /**
   * Cập nhật trạng thái subscription
   */
  async updateSubscriptionStatus(req, res) {
    try {
      const { subscriptionId } = req.params;
      this.validateId(subscriptionId);

      this.validateRequiredFields(req, ["status"]);

      const subscription = await this.model.updateSubscriptionStatus(
        subscriptionId, 
        req.body.status
      );

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: "Subscription not found",
        });
      }

      res.json({
        success: true,
        data: subscription,
        message: "Subscription status updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update subscription status");
    }
  }

  /**
   * Hủy subscription
   */
  async cancelSubscription(req, res) {
    try {
      const { subscriptionId, userId } = req.params;
      this.validateId(subscriptionId);
      this.validateId(userId);

      const subscription = await this.model.cancelSubscription(subscriptionId, userId);

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: "Subscription not found",
        });
      }

      res.json({
        success: true,
        data: subscription,
        message: "Subscription cancelled successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to cancel subscription");
    }
  }

  /**
   * Kiểm tra xem user có subscription active không
   */
  async checkActiveSubscription(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const hasActive = await this.model.hasActiveSubscription(userId);

      res.json({
        success: true,
        data: { hasActiveSubscription: hasActive },
        message: "Subscription status checked successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to check subscription status");
    }
  }

  /**
   * Lấy thống kê subscriptions
   */
  async getSubscriptionStats(req, res) {
    try {
      const stats = await this.model.getSubscriptionStats();

      res.json({
        success: true,
        data: stats,
        message: "Subscription statistics retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get subscription statistics");
    }
  }

  /**
   * Lấy subscriptions sắp hết hạn
   */
  async getExpiringSubscriptions(req, res) {
    try {
      const days = req.query.days ? parseInt(req.query.days) : 7;
      const subscriptions = await this.model.getExpiringSubscriptions(days);

      res.json({
        success: true,
        data: subscriptions,
        message: "Expiring subscriptions retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get expiring subscriptions");
    }
  }

  /**
   * Renew subscription
   */
  async renewSubscription(req, res) {
    try {
      const { subscriptionId } = req.params;
      this.validateId(subscriptionId);

      this.validateRequiredFields(req, ["end_date"]);

      const subscription = await this.model.update(subscriptionId, {
        end_date: req.body.end_date,
        status: 'active'
      });

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: "Subscription not found",
        });
      }

      res.json({
        success: true,
        data: subscription,
        message: "Subscription renewed successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to renew subscription");
    }
  }
}

module.exports = SubscriptionController; 