const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class SubscriptionModel extends BaseModel {
  constructor() {
    super("subscriptions", "id");
  }

  /**
   * Tạo subscription mới
   */
  async createSubscription(subscriptionData) {
    const sql = `
      INSERT INTO subscriptions (
        user_id, plan_type, status, start_date, end_date, payment_gateway_transaction_id
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      subscriptionData.user_id,
      subscriptionData.plan_type,
      subscriptionData.status || 'active',
      subscriptionData.start_date,
      subscriptionData.end_date,
      subscriptionData.payment_gateway_transaction_id || null
    ];

    return await DatabaseHelper.getOne(sql, values);
  }

  /**
   * Lấy subscription hiện tại của user
   */
  async getCurrentSubscription(userId) {
    const sql = `
      SELECT * FROM subscriptions 
      WHERE user_id = $1 AND status = 'active' AND end_date > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;
    return await DatabaseHelper.getOne(sql, [userId]);
  }

  /**
   * Lấy tất cả subscriptions của user
   */
  async getSubscriptionsByUserId(userId) {
    const sql = `
      SELECT * FROM subscriptions 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    return await DatabaseHelper.getAll(sql, [userId]);
  }

  /**
   * Cập nhật trạng thái subscription
   */
  async updateSubscriptionStatus(subscriptionId, status) {
    const sql = `
      UPDATE subscriptions 
      SET status = $2 
      WHERE id = $1
      RETURNING *
    `;
    return await DatabaseHelper.getOne(sql, [subscriptionId, status]);
  }

  /**
   * Hủy subscription
   */
  async cancelSubscription(subscriptionId, userId) {
    const sql = `
      UPDATE subscriptions 
      SET status = 'cancelled' 
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    return await DatabaseHelper.getOne(sql, [subscriptionId, userId]);
  }

  /**
   * Kiểm tra xem user có subscription active không
   */
  async hasActiveSubscription(userId) {
    const subscription = await this.getCurrentSubscription(userId);
    return !!subscription;
  }

  /**
   * Lấy thống kê subscriptions
   */
  async getSubscriptionStats() {
    const sql = `
      SELECT 
        plan_type,
        status,
        COUNT(*) as count
      FROM subscriptions 
      GROUP BY plan_type, status
    `;
    return await DatabaseHelper.getAll(sql);
  }

  /**
   * Lấy subscriptions sắp hết hạn
   */
  async getExpiringSubscriptions(days = 7) {
    const sql = `
      SELECT s.*, u.email, u.phone_number
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      WHERE s.status = 'active' 
        AND s.end_date BETWEEN NOW() AND NOW() + INTERVAL '${days} days'
      ORDER BY s.end_date ASC
    `;
    return await DatabaseHelper.getAll(sql);
  }
}

module.exports = SubscriptionModel; 