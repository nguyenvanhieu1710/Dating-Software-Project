const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class AdminUserModel extends BaseModel {
  constructor() {
    super("admin_users", "id");
  }

  /**
   * Lấy tất cả admin users
   */
  async findAll() {
    const sql = `
      SELECT 
          id, email, full_name, role, is_active, last_login_at, created_at, updated_at, created_by
      FROM admin_users
      WHERE is_active = TRUE
      ORDER BY created_at DESC
    `;
    return await DatabaseHelper.getAll(sql);
  }

  /**
   * Lấy admin user theo ID
   */
  async findById(id) {
    const sql = `
      SELECT 
          id, email, full_name, role, is_active, last_login_at, created_at, updated_at, created_by
      FROM admin_users
      WHERE id = $1 AND is_active = TRUE
    `;
    return await DatabaseHelper.getOne(sql, [id]);
  }

  /**
   * Lấy admin user hiện tại (dựa trên ID từ token)
   */
  async findCurrentAdmin(adminId) {
    const sql = `
      SELECT 
          id, email, full_name, role, is_active, last_login_at, created_at, updated_at, created_by
      FROM admin_users
      WHERE id = $1 AND is_active = TRUE
    `;
    return await DatabaseHelper.getOne(sql, [adminId]);
  }

  /**
   * Lấy tất cả admin users đang active
   */
  async findActiveAdmins() {
    const sql = `
      SELECT 
          id, email, full_name, role, is_active, last_login_at, created_at, updated_at, created_by
      FROM admin_users
      WHERE is_active = TRUE
      ORDER BY last_login_at DESC
    `;
    return await DatabaseHelper.getAll(sql);
  }

  /**
   * Lấy admin user theo email
   */
  async findByEmail(email) {
    const sql = `
      SELECT 
          id, email, full_name, role, is_active, last_login_at, created_at, updated_at, created_by
      FROM admin_users
      WHERE email = $1
    `;
    return await DatabaseHelper.getOne(sql, [email]);
  }

  /**
   * Tạo admin user mới
   */
  async create(adminData) {
    return await DatabaseHelper.transaction(async (client) => {
      const allowedFields = [
        "email", "password_hash", "full_name", "role", "is_active", "created_by"
      ];
      const columns = Object.keys(adminData).filter((key) => allowedFields.includes(key));
      const values = columns.map((key) => adminData[key]);
      const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

      const sql = `
        INSERT INTO admin_users (${columns.join(", ")})
        VALUES (${placeholders})
        RETURNING id, email, full_name, role, is_active, last_login_at, created_at, updated_at, created_by
      `;
      const result = await client.query(sql, values);
      return result.rows[0];
    });
  }

  /**
   * Cập nhật admin user
   */
  async update(id, adminData) {
    return await DatabaseHelper.transaction(async (client) => {
      const allowedFields = [
        "email", "password_hash", "full_name", "role", "is_active", "last_login_at"
      ];
      const columns = Object.keys(adminData).filter((key) => allowedFields.includes(key));
      const values = columns.map((key) => adminData[key]);
      const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(", ");

      const sql = `
        UPDATE admin_users
        SET ${setClause}, updated_at = NOW()
        WHERE id = $${values.length + 1}
        RETURNING id, email, full_name, role, is_active, last_login_at, created_at, updated_at, created_by
      `;
      const result = await client.query(sql, [...values, id]);
      return result.rows[0];
    });
  }

  /**
   * Xóa admin user (soft delete bằng cách đặt is_active = FALSE)
   */
  async delete(id) {
    const sql = `
      UPDATE admin_users
      SET is_active = FALSE, updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, full_name, role, is_active, last_login_at, created_at, updated_at, created_by
    `;
    return await DatabaseHelper.getOne(sql, [id]);
  }
}

module.exports = AdminUserModel;