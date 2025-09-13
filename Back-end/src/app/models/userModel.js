const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class UserModel extends BaseModel {
  constructor() {
    super("users", "id");
  }

  /**
   * Lấy tất cả users với thông tin profile
   */
  async findAllWithProfile() {
    const sql = `
            SELECT u.id, u.email, u.phone_number, u.status, u.created_at, u.updated_at, p.*
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            ORDER BY u.created_at DESC
        `;
    return await DatabaseHelper.getAll(sql);
  }

  /**
   * Lấy user theo email (không bao gồm password_hash)
   */
  async findByEmail(email) {
    const sql = `
            SELECT u.id, u.email, u.phone_number, u.status, u.created_at, u.updated_at, p.*
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            WHERE u.email = $1
        `;
    return await DatabaseHelper.getOne(sql, [email]);
  }

  /**
   * Lấy user theo email cho login (bao gồm password_hash)
   */
  async findByEmailForLogin(email) {
    const sql = `
            SELECT u.id, u.email, u.phone_number, u.password_hash, u.status, u.created_at, u.updated_at
            FROM users u
            WHERE u.email = $1
        `;
    return await DatabaseHelper.getOne(sql, [email]);
  }

  /**
   * Tạo user với profile
   */
  async createWithProfile(userData, profileData = {}) {
    return await DatabaseHelper.transaction(async (client) => {
      // Chỉ lấy các trường hợp lệ cho bảng users
      const allowedUserFields = ["email", "phone_number", "password_hash", "status"];
      const userColumns = Object.keys(userData).filter((key) => allowedUserFields.includes(key));
      const userValues = userColumns.map((key) => userData[key]);
      const userPlaceholders = userValues
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      const userSql = `
                INSERT INTO users (${userColumns.join(", ")})
                VALUES (${userPlaceholders})
                RETURNING *
            `;

      const user = await client.query(userSql, userValues);

      // Tạo profile nếu có data
      if (Object.keys(profileData).length > 0) {
        const profileColumns = Object.keys(profileData);
        const profileValues = Object.values(profileData);
        const profilePlaceholders = profileValues
          .map((_, index) => `$${index + 1}`)
          .join(", ");

        const profileSql = `
                    INSERT INTO profiles (user_id, ${profileColumns.join(", ")})
                    VALUES ($${profileValues.length + 1}, ${profilePlaceholders})
                    RETURNING *
                `;

        await client.query(profileSql, [...profileValues, user.rows[0].id]);
      }

      return user.rows[0];
    });
  }

  /**
   * Cập nhật user với profile
   */
  async updateWithProfile(id, userData, profileData = {}) {
    return await DatabaseHelper.transaction(async (client) => {
      // Chỉ lấy các trường hợp lệ cho bảng users
      const allowedUserFields = ["email", "phone_number", "password_hash", "status"];
      const userColumns = Object.keys(userData).filter((key) => allowedUserFields.includes(key));
      const userValues = userColumns.map((key) => userData[key]);
      const userSetClause = userColumns
        .map((col, index) => `${col} = $${index + 1}`)
        .join(", ");

      let userSql = null;
      let user = null;
      if (userColumns.length > 0) {
        userSql = `
                UPDATE users
                SET ${userSetClause}, updated_at = NOW()
                WHERE id = $${userValues.length + 1}
                RETURNING *
            `;
        user = await client.query(userSql, [...userValues, id]);
      } else {
        user = await client.query(`SELECT * FROM users WHERE id = $1`, [id]);
      }

      // Cập nhật profile nếu có data
      if (Object.keys(profileData).length > 0) {
        const profileColumns = Object.keys(profileData);
        const profileValues = Object.values(profileData);
        const profileSetClause = profileColumns
          .map((col, index) => `${col} = $${index + 1}`)
          .join(", ");

        const profileSql = `
                    UPDATE profiles
                    SET ${profileSetClause}, updated_at = NOW()
                    WHERE user_id = $${profileValues.length + 1}
                `;

        await client.query(profileSql, [...profileValues, id]);
      }

      return user.rows[0];
    });
  }

  /**
   * Tìm kiếm users theo nhiều tiêu chí
   */
  async searchUsers(criteria) {
    const { keyword, status, limit = 10, offset = 0 } = criteria;

    let sql = `
            SELECT u.id, u.email, u.phone_number, u.status, u.created_at, u.updated_at, p.*
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            WHERE 1=1
        `;

    const params = [];
    let paramIndex = 1;

    if (keyword) {
      sql += ` AND (u.email ILIKE $${paramIndex} OR u.phone_number ILIKE $${paramIndex})`;
      params.push(`%${keyword}%`);
      paramIndex++;
    }

    if (status) {
      sql += ` AND u.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    sql += ` ORDER BY u.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    return await DatabaseHelper.getAll(sql, params);
  }

  /**
   * Đếm số users theo status
   */
  async countByStatus() {
    const sql = `
            SELECT status, COUNT(*) as count
            FROM users
            GROUP BY status
        `;
    return await DatabaseHelper.getAll(sql);
  }
}

module.exports = UserModel;
