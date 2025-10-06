const BaseController = require("./BaseController");
const SubscriptionModel = require("../models/subscriptionModel");

class SubscriptionController extends BaseController {
  constructor() {
    super(new SubscriptionModel());
  }

  /**
   * Getl all subscriptions
   */
  async getAllSubscriptions(req, res){
    try {      
      const subscriptions = await this.model.getAllSubscriptions();

      res.json({
        success: true,
        data: subscriptions,
        message: "Subscriptions retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get subscriptions");
    }
  }

  /**
   * get subscription by id
   */
  async getSubscriptionById(req, res){
    try {
      const { subscriptionId } = req.params;
      this.validateId(subscriptionId);

      const subscription = await this.model.getSubscriptionById(subscriptionId);

      res.json({
        success: true,
        data: subscription,
        message: "Subscription retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get subscription");
    }
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
   * update subscription
   */
  async updateSubscription(req, res){
    try {
      const { subscriptionId } = req.params;
      this.validateId(subscriptionId);

      const subscription = await this.model.updateSubscription(subscriptionId, req.body);

      res.json({
        success: true,
        data: subscription,
        message: "Subscription updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update subscription");
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
}

module.exports = SubscriptionController; 