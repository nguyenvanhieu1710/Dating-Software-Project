const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class PaymentModel extends BaseModel {
  constructor() {
    super("payments", "id");
  }

  /**
   * Lấy tất cả payments
   */
  async findAll() {
    const sql = `
      SELECT 
          p.id, p.user_id, p.subscription_id, p.consumable_type, p.quantity,
          p.amount, p.currency, p.payment_method, p.transaction_id, p.provider_response,
          p.status, p.consumable_status, p.expiry_date, p.platform, p.is_recurring,
          p.next_billing_date, p.created_at, p.updated_at,
          u.email AS user_email
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `;
    return await DatabaseHelper.getAll(sql);
  }

  /**
   * Lấy payment theo ID
   */
  async findById(id) {
    const sql = `
      SELECT 
          p.id, p.user_id, p.subscription_id, p.consumable_type, p.quantity,
          p.amount, p.currency, p.payment_method, p.transaction_id, p.provider_response,
          p.status, p.consumable_status, p.expiry_date, p.platform, p.is_recurring,
          p.next_billing_date, p.created_at, p.updated_at,
          u.email AS user_email
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `;
    return await DatabaseHelper.getOne(sql, [id]);
  }

  /**
   * Lấy payments theo user_id
   */
  async findByUserId(userId) {
    const sql = `
      SELECT 
          p.id, p.user_id, p.subscription_id, p.consumable_type, p.quantity,
          p.amount, p.currency, p.payment_method, p.transaction_id, p.provider_response,
          p.status, p.consumable_status, p.expiry_date, p.platform, p.is_recurring,
          p.next_billing_date, p.created_at, p.updated_at,
          u.email AS user_email
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
    `;
    return await DatabaseHelper.getAll(sql, [userId]);
  }

  /**
   * Tạo payment mới
   */
  async create(paymentData) {
    return await DatabaseHelper.transaction(async (client) => {
      const allowedFields = [
        "user_id", "subscription_id", "consumable_type", "quantity", "amount",
        "currency", "payment_method", "transaction_id", "provider_response",
        "status", "consumable_status", "expiry_date", "platform", "is_recurring",
        "next_billing_date"
      ];
      const columns = Object.keys(paymentData).filter((key) => allowedFields.includes(key));
      const values = columns.map((key) => paymentData[key]);
      const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

      if (columns.length === 0) {
        throw new Error("No valid payment data provided");
      }

      const sql = `
        INSERT INTO payments (${columns.join(", ")})
        VALUES (${placeholders})
        RETURNING *
      `;
      const result = await client.query(sql, values);
      return result.rows[0];
    });
  }

  /**
   * Xóa payment (soft delete bằng cách cập nhật status)
   */
  async delete(id) {
    const sql = `
      UPDATE payments
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    return await DatabaseHelper.getOne(sql, [id]);
  }

  /**
   * Xử lý payment (processPayment) - ví dụ: tạo payment và cập nhật subscription hoặc consumables
   */
  async processPayment(paymentData) {
    return await DatabaseHelper.transaction(async (client) => {
      // Tạo payment
      const newPayment = await this.create(paymentData);

      // Nếu là subscription payment
      if (newPayment.subscription_id) {
        const subscriptionUpdateSql = `
          UPDATE subscriptions
          SET status = 'active',
              last_payment_date = NOW(),
              next_billing_date = $1,
              updated_at = NOW()
          WHERE id = $2
          RETURNING *
        `;
        await client.query(subscriptionUpdateSql, [
          paymentData.next_billing_date || new Date(new Date().setMonth(new Date().getMonth() + 1)),
          newPayment.subscription_id
        ]);
      }

      // Nếu là consumable payment
      if (newPayment.consumable_type) {
        const consumableUpdateSql = `
          UPDATE consumables
          SET ${newPayment.consumable_type}_balance = ${newPayment.consumable_type}_balance + $1,
              updated_at = NOW()
          WHERE user_id = $2
          RETURNING *
        `;
        await client.query(consumableUpdateSql, [newPayment.quantity, newPayment.user_id]);
      }

      return newPayment;
    });
  }
}

module.exports = PaymentModel;