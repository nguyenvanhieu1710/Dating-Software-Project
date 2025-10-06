const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class UserDevicesModel extends BaseModel {
  constructor() {
    super("user_devices", "id");
  }

  /**
   * Lấy tất cả thiết bị của một user
   */
  async findByUserId(userId, { page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT id, user_id, device_token, platform, device_model, app_version, last_ip, last_active_at, created_at, updated_at
      FROM user_devices
      WHERE user_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    return await DatabaseHelper.getAll(sql, [userId, limit, offset]);
  }

  /**
   * Tìm thiết bị theo device_token và user_id
   */
  async findByDeviceToken(userId, deviceToken) {
    const sql = `
      SELECT id, user_id, device_token, platform, device_model, app_version, last_ip, last_active_at, created_at, updated_at
      FROM user_devices
      WHERE user_id = $1 AND device_token = $2 AND deleted_at IS NULL
    `;
    return await DatabaseHelper.getOne(sql, [userId, deviceToken]);
  }

  /**
   * Lấy tất cả thiết bị (admin-only)
   */
  async findAll({ page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT id, user_id, device_token, platform, device_model, app_version, last_ip, last_active_at, created_at, updated_at
      FROM user_devices
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    return await DatabaseHelper.getAll(sql, [limit, offset]);
  }

  /**
   * Lấy thiết bị theo ID
   */
  async findById(id) {
    const sql = `
      SELECT id, user_id, device_token, platform, device_model, app_version, last_ip, last_active_at, created_at, updated_at
      FROM user_devices
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await DatabaseHelper.getOne(sql, [id]);
  }

  /**
   * Tạo thiết bị mới
   */
  async create(deviceData) {
    return await DatabaseHelper.transaction(async (client) => {
      const allowedFields = [
        "user_id",
        "device_token",
        "platform",
        "device_model",
        "app_version",
        "last_ip",
        "last_active_at",
        "created_at",
        "updated_at",
      ];
      const columns = Object.keys(deviceData).filter((key) => allowedFields.includes(key));
      const values = columns.map((key) => deviceData[key]);
      const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

      const sql = `
        INSERT INTO user_devices (${columns.join(", ")})
        VALUES (${placeholders})
        RETURNING id, user_id, device_token, platform, device_model, app_version, last_ip, last_active_at, created_at, updated_at
      `;
      const result = await client.query(sql, values);
      return result.rows[0];
    });
  }

  /**
   * Cập nhật thiết bị
   */
  async update(id, deviceData) {
    return await DatabaseHelper.transaction(async (client) => {
      const allowedFields = [
        "device_token",
        "platform",
        "device_model",
        "app_version",
        "last_ip",
        "last_active_at",
        "updated_at",
      ];
      const columns = Object.keys(deviceData).filter((key) => allowedFields.includes(key));
      const values = columns.map((key) => deviceData[key]);
      const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(", ");

      const sql = `
        UPDATE user_devices
        SET ${setClause}, updated_at = NOW()
        WHERE id = $${values.length + 1} AND deleted_at IS NULL
        RETURNING id, user_id, device_token, platform, device_model, app_version, last_ip, last_active_at, created_at, updated_at
      `;
      const result = await client.query(sql, [...values, id]);
      return result.rows[0];
    });
  }

  /**
   * Xóa thiết bị (soft delete)
   */
  async delete(id) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        UPDATE user_devices
        SET deleted_at = NOW()
        WHERE id = $1
        RETURNING id, user_id, device_token, platform, device_model, app_version, last_ip, last_active_at, created_at, updated_at
      `;
      const result = await client.query(sql, [id]);
      return result.rows[0];
    });
  }
}

module.exports = UserDevicesModel;