const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class SubscriptionModel extends BaseModel {
  constructor() {
    super("subscriptions", "id");
  }

  /**
   * Get all subscriptions
   */
  async getAllSubscriptions() {
    const sql = `
      SELECT * FROM subscriptions
    `;
    return await DatabaseHelper.getAll(sql);
  }

  /**
   * Get subscription by id
   */
  async getSubscriptionById(id) {
    const sql = `
      SELECT * FROM subscriptions WHERE id = $1
    `;
    return await DatabaseHelper.getOne(sql, [id]);
  }

  /**
   * Tạo subscription mới
   */
  async createSubscription(subscriptionData) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        INSERT INTO subscriptions (
          user_id, plan_type, status, billing_cycle,
          start_date, end_date, next_billing_date,
          price, currency, payment_method, auto_renew, 
          trial_period, trial_end_date,
          discount_applied, promo_code, platform,
          transaction_id, last_payment_date,
          failed_payments, refund_status, refund_amount,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4,
          $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13,
          $14, $15, $16,
          $17, $18,
          $19, $20, $21,
          NOW(), NOW()
        )
        RETURNING *
      `;
  
      const values = [
        subscriptionData.user_id,
        subscriptionData.plan_type,
        subscriptionData.status || "active",
        subscriptionData.billing_cycle || "monthly",
        subscriptionData.start_date,
        subscriptionData.end_date,
        subscriptionData.next_billing_date,
        subscriptionData.price,
        subscriptionData.currency || "USD",
        subscriptionData.payment_method,
        subscriptionData.auto_renew ?? true,
        subscriptionData.trial_period ?? false,
        subscriptionData.trial_end_date,
        subscriptionData.discount_applied || 0,
        subscriptionData.promo_code,
        subscriptionData.platform,
        subscriptionData.transaction_id,
        subscriptionData.last_payment_date,
        subscriptionData.failed_payments || 0,
        subscriptionData.refund_status,
        subscriptionData.refund_amount || 0
      ];
  
      return await DatabaseHelper.getOne(sql, values, client);
    });
  }

  /**
   * Cập nhật subscription
   */
  async updateSubscription(subscriptionId, data) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        UPDATE subscriptions
        SET 
          plan_type = COALESCE($2, plan_type),
          status = COALESCE($3, status),
          billing_cycle = COALESCE($4, billing_cycle),
          start_date = COALESCE($5, start_date),
          end_date = COALESCE($6, end_date),
          next_billing_date = COALESCE($7, next_billing_date),
          price = COALESCE($8, price),
          currency = COALESCE($9, currency),
          payment_method = COALESCE($10, payment_method),
          auto_renew = COALESCE($11, auto_renew),
          trial_period = COALESCE($12, trial_period),
          trial_end_date = COALESCE($13, trial_end_date),
          discount_applied = COALESCE($14, discount_applied),
          promo_code = COALESCE($15, promo_code),
          platform = COALESCE($16, platform),
          transaction_id = COALESCE($17, transaction_id),
          last_payment_date = COALESCE($18, last_payment_date),
          failed_payments = COALESCE($19, failed_payments),
          cancelled_at = COALESCE($20, cancelled_at),
          cancellation_reason = COALESCE($21, cancellation_reason),
          refund_status = COALESCE($22, refund_status),
          refund_amount = COALESCE($23, refund_amount),
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
  
      const values = [
        subscriptionId,
        data.plan_type,
        data.status,
        data.billing_cycle,
        data.start_date,
        data.end_date,
        data.next_billing_date,
        data.price,
        data.currency,
        data.payment_method,
        data.auto_renew,
        data.trial_period,
        data.trial_end_date,
        data.discount_applied,
        data.promo_code,
        data.platform,
        data.transaction_id,
        data.last_payment_date,
        data.failed_payments,
        data.cancelled_at,
        data.cancellation_reason,
        data.refund_status,
        data.refund_amount
      ];
  
      return await DatabaseHelper.getOne(sql, values, client);
    });
  }

  /**
   * Hủy subscription
   */
  async cancelSubscription(subscriptionId, userId, reason = null) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        UPDATE subscriptions
        SET 
          status = 'cancelled',
          cancelled_at = NOW(),
          cancellation_reason = COALESCE($3, cancellation_reason),
          updated_at = NOW()
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `;
      return await DatabaseHelper.getOne(sql, [subscriptionId, userId, reason], client);
    });
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
}

module.exports = SubscriptionModel;
