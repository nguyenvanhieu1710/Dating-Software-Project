const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class NotificationModel extends BaseModel {
  constructor() {
    super("notifications", "id");
  }

  /**
   * Lấy tất cả thông báo của một user
   */
  async findByUserId(userId, { page = 1, limit = 20, filters = {} }) {
    const offset = (page - 1) * limit;
    let sql = `
    SELECT id, user_id, title, body, data, sent_at, read_at, created_at
    FROM notifications
    WHERE user_id = $1
  `;
    const params = [userId];

    let paramIndex = 2;
    if (filters.type) {
      sql += ` AND data->>'type' = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    return await DatabaseHelper.getAll(sql, params);
  }

  /**
   * Đánh dấu tất cả thông báo của user là đã đọc
   */
  async markAllAsRead(userId) {
    const sql = `
      UPDATE notifications
      SET read_at = NOW()
      WHERE user_id = $1 AND read_at IS NULL
      RETURNING id, user_id, title, body, data, sent_at, read_at, created_at
    `;
    return await DatabaseHelper.getAll(sql, [userId]);
  }

  /**
   * Lấy tất cả thông báo (admin-only)
   */
  async findAll({ page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT id, user_id, title, body, data, sent_at, read_at, created_at
      FROM notifications
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    return await DatabaseHelper.getAll(sql, [limit, offset]);
  }

  /**
   * Lấy thông báo theo ID
   */
  async findById(id) {
    const sql = `
      SELECT id, user_id, title, body, data, sent_at, read_at, created_at
      FROM notifications
      WHERE id = $1
    `;
    return await DatabaseHelper.getOne(sql, [id]);
  }

  /**
   * Tạo thông báo mới
   */
  async create(notificationData) {
    return await DatabaseHelper.transaction(async (client) => {
      const allowedFields = [
        "user_id",
        "title",
        "body",
        "data",
        "sent_at",
        "read_at",
        "created_at",
      ];
      const columns = Object.keys(notificationData).filter((key) =>
        allowedFields.includes(key)
      );
      const values = columns.map((key) => notificationData[key]);
      const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

      const sql = `
        INSERT INTO notifications (${columns.join(", ")})
        VALUES (${placeholders})
        RETURNING id, user_id, title, body, data, sent_at, read_at, created_at
      `;
      const result = await client.query(sql, values);
      return result.rows[0];
    });
  }

  /**
   * Xóa thông báo (soft delete)
   */
  async delete(id) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        UPDATE notifications
        SET deleted_at = NOW()
        WHERE id = $1
        RETURNING id, user_id, title, body, data, sent_at, read_at, created_at
      `;
      const result = await client.query(sql, [id]);
      return result.rows[0];
    });
  }
}

module.exports = NotificationModel;
