const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class UserModel extends BaseModel {
  constructor() {
    super("users", "id");
  }

  /**
   * Đề xuất các người dùng khác cho người dùng hiện tại và không có người dùng hiện tại trong danh sách
   */
  async getRecommendUsers(userId) {
    const sql = `
      SELECT DISTINCT
          u.id, u.email, u.phone_number, u.status,
          u.created_at, u.updated_at,
          p.user_id, p.first_name, p.dob, p.gender, p.bio, p.job_title,
          p.company, p.school, p.education, p.height_cm, p.relationship_goals,
          p.location, p.popularity_score, p.message_count, p.last_active_at,
          p.is_verified, p.is_online, p.last_seen,
          p.created_at as profile_created_at,
          p.updated_at as profile_updated_at,
          -- Tính điểm tương thích
          (
            CASE WHEN current_p.location = p.location THEN 10 ELSE 0 END +
            CASE WHEN current_p.relationship_goals = p.relationship_goals THEN 15 ELSE 0 END +
            CASE WHEN current_p.education = p.education THEN 5 ELSE 0 END +
            CASE WHEN ABS(EXTRACT(YEAR FROM AGE(current_p.dob)) - EXTRACT(YEAR FROM AGE(p.dob))) <= 5 THEN 8 ELSE 0 END +
            COALESCE(p.popularity_score, 0)
          ) as compatibility_score
      FROM users u
      INNER JOIN profiles p ON u.id = p.user_id
      INNER JOIN profiles current_p ON current_p.user_id = $1
      WHERE u.id != $1
        AND u.status = 'active'
        AND p.first_name IS NOT NULL        
      ORDER BY compatibility_score DESC, p.last_active_at DESC
      LIMIT 50
    `;

    return await DatabaseHelper.getAll(sql, [userId]);
  }

  /**
   * Lấy tất cả users với thông tin profile
   */
  async findAllWithProfile() {
    const sql = `
      SELECT 
          u.id, u.email, u.phone_number, u.status, u.password_hash,
          u.created_at, u.updated_at,
          p.user_id, p.first_name, p.dob, p.gender, p.bio, p.job_title,
          p.company, p.school, p.education, p.height_cm, p.relationship_goals,
          p.location, p.popularity_score, p.message_count, p.last_active_at,
          p.is_verified, p.is_online, p.last_seen,
          p.created_at as profile_created_at,
          p.updated_at as profile_updated_at
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.status != 'deleted'
      ORDER BY u.created_at DESC
    `;
    return await DatabaseHelper.getAll(sql);
  }

  /**
   * Lấy user by id không với profile
   */
  async findById(id) {
    const sql = `
      SELECT * FROM users WHERE id = $1
    `;
    return await DatabaseHelper.getOne(sql, [id]);
  }

  /**
   * lấy user by id with profile
   */
  async findByIdWithProfile(id) {
    const sql = `
        SELECT 
            -- User fields
            u.id, 
            u.email, 
            u.phone_number, 
            u.status, 
            u.password_hash,
            u.created_at, 
            u.updated_at,
            
            -- Profile fields
            p.user_id, 
            p.first_name, 
            p.dob, 
            p.gender, 
            p.bio, 
            p.job_title,
            p.company, 
            p.school, 
            p.education, 
            p.height_cm, 
            p.relationship_goals,
            p.location, 
            p.popularity_score, 
            p.message_count, 
            p.last_active_at,
            p.is_verified, 
            p.is_online, 
            p.last_seen,
            p.created_at AS profile_created_at,
            p.updated_at AS profile_updated_at
        FROM users u
        LEFT JOIN profiles p ON u.id = p.user_id
        WHERE u.status != 'deleted' 
        AND u.id = $1
    `;
    return await DatabaseHelper.getOne(sql, [id]);
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
   * Tạo user với profile
   */
  async createWithProfile(userData, profileData) {
    return await DatabaseHelper.transaction(async (client) => {
      const allowedAuthFields = [
        "email",
        "phone_number",
        "password_hash",
        "status",
      ];
      const userColumns = Object.keys(userData).filter((key) =>
        allowedAuthFields.includes(key)
      );
      const userValues = userColumns.map((key) => userData[key]);
      const userPlaceholders = userValues
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      const userSql = `
                INSERT INTO users (${userColumns.join(", ")})
                VALUES (${userPlaceholders})
                RETURNING *
            `;
      // console.log("User SQL:", userSql);
      console.log("User values:", userValues);
      //   return;
      const user = await client.query(userSql, userValues);

      // Tạo profile
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
        // console.log("Profile SQL:", profileSql);
        console.log("Profile values:", profileValues);
        // return;
        await client.query(profileSql, [...profileValues, user.rows[0].id]);
      }

      return user.rows[0];
    });
  }

  /**
   * Cập nhật user với profile
   */
  async updateWithProfile(id, userData, profileData) {
    return await DatabaseHelper.transaction(async (client) => {
      // Chỉ lấy các trường hợp lệ cho bảng users
      const allowedUserFields = [
        "email",
        "phone_number",
        "password_hash",
        "status",
      ];
      const userColumns = Object.keys(userData).filter((key) =>
        allowedUserFields.includes(key)
      );
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
   * Delete user with profile (soft delete)
   */
  async deleteWithProfile(id) {
    return await DatabaseHelper.transaction(async (client) => {
      try {
        // 1. First get the user data before deleting
        const getUserSql = `
          SELECT id, email, status, created_at, updated_at
          FROM users 
          WHERE id = $1
        `;
        const userResult = await client.query(getUserSql, [id]);

        const user = userResult.rows[0];

        // 2. Soft delete the user
        const deleteSql = `
          UPDATE users
          SET status = 'deleted',
              updated_at = NOW()
          WHERE id = $1
          RETURNING id, email, status, created_at, updated_at
        `;

        const deletedUser = await client.query(deleteSql, [id]);

        return deletedUser.rows[0]; // Return the deleted user data
      } catch (error) {
        throw error;
      }
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
   * Get verifications
   */
  async getVerifications(params = {}) {
    let sql = `
      SELECT 
        uv.id AS verification_id,
        uv.user_id,
        uv.verification_type,
        COALESCE(uv.status, 'not_submitted') AS verification_status,
        uv.evidence_url,
        uv.reviewed_by,
        uv.reviewed_at,
        uv.notes,
        uv.created_at AS verification_created_at,
        uv.updated_at AS verification_updated_at,
        u.email,
        u.phone_number,
        u.status AS user_status
      FROM users u
      LEFT JOIN user_verifications uv ON u.id = uv.user_id
      WHERE u.status != 'deleted'
    `;
    const conditions = [];
    const values = [];
    if (params.status && params.status !== "all") {
      conditions.push(`uv.status = $${values.length + 1}`);
      values.push(params.status);
    }
    if (conditions.length) sql += ` WHERE ${conditions.join(" AND ")}`;
    sql += ` ORDER BY uv.created_at ASC NULLS LAST`;
    return await DatabaseHelper.getAll(sql, values);
  }

  /**
   * Get verifications by id
   */
  async getVerificationsById(id) {
    return await DatabaseHelper.getOne(
      `SELECT * FROM user_verifications WHERE id = $1`,
      [id]
    );
  }

  /**
   * Get verifications by user id
   */
  async getVerificationsByUserId(user_id) {
    return await DatabaseHelper.getAll(
      `SELECT * FROM user_verifications WHERE user_id = $1`,
      [user_id]
    );
  }

  /**
   * Update verification
   */
  async updateVerification(id, verificationData) {
    return await DatabaseHelper.transaction(async (client) => {
      // Sửa: dùng tên bảng cụ thể
      const existingRecord = await client.query(
        `SELECT id FROM user_verifications WHERE id = $1`,
        [id]
      );

      if (existingRecord.rows.length === 0) {
        throw new Error("Verification not found");
      }

      const allowedFields = ["status", "reviewed_by", "reviewed_at", "notes"];
      const columns = Object.keys(verificationData).filter((key) =>
        allowedFields.includes(key)
      );
      const values = columns.map((key) => verificationData[key]);
      const setClause = columns
        .map((col, index) => `${col} = $${index + 1}`)
        .join(", ");

      if (columns.length === 0) {
        throw new Error("No valid fields provided for update");
      }

      // Sửa: dùng tên bảng cụ thể
      const sql = `
      UPDATE user_verifications
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${values.length + 1}
      RETURNING id, user_id, verification_type, status, evidence_url, reviewed_by, reviewed_at, notes, created_at, updated_at
    `;
      const result = await client.query(sql, [...values, id]);
      return result.rows[0];
    });
  }

  /**
   * get all block
   */
  async getBlocks() {
    return await DatabaseHelper.getAll(`SELECT * FROM user_blocks`);
  }

  /**
   * Block a user
   */
  async blockUser(blocker_id, blocked_id) {
    return await DatabaseHelper.transaction(async (client) => {
      const existingRecord = await client.query(
        `SELECT id FROM user_blocks WHERE blocker_id = $1 AND blocked_id = $2`,
        [blocker_id, blocked_id]
      );

      if (existingRecord.rows.length > 0) {
        throw new Error("User already blocked");
      }

      const sql = `
        INSERT INTO user_blocks (blocker_id, blocked_id)
        VALUES ($1, $2)
        RETURNING id, blocker_id, blocked_id, created_at
      `;
      const result = await client.query(sql, [blocker_id, blocked_id]);
      return result.rows[0];
    });
  }

  /**
   * Unblock a user
   */
  async unblockUser(blocker_id, blocked_id) {
    return await DatabaseHelper.transaction(async (client) => {
      const existingRecord = await client.query(
        `SELECT id FROM user_blocks WHERE blocker_id = $1 AND blocked_id = $2`,
        [blocker_id, blocked_id]
      );

      if (existingRecord.rows.length === 0) {
        throw new Error("User not blocked");
      }

      const sql = `
        DELETE FROM user_blocks
        WHERE blocker_id = $1 AND blocked_id = $2
        RETURNING id, blocker_id, blocked_id, created_at
      `;
      const result = await client.query(sql, [blocker_id, blocked_id]);
      return result.rows[0];
    });
  }

  /**
   * get all device
   */
  async getDevices() {
    return await DatabaseHelper.getAll(`SELECT * FROM user_devices`);
  }

  /**
   * registerDevice (tạo thiết bị khi người dùng login)
   */
  async registerDevice(user_device_data) {
    return await DatabaseHelper.transaction(async (client) => {
      // Kiểm tra xem device đã tồn tại chưa (dựa trên user_id + device_token)
      if (user_device_data.device_token) {
        const existingDevice = await client.query(
          `SELECT id FROM user_devices WHERE user_id = $1 AND device_token = $2`,
          [user_device_data.user_id, user_device_data.device_token]
        );

        if (existingDevice.rows.length > 0) {
          // Nếu đã tồn tại thì update thông tin
          const updateSql = `
          UPDATE user_devices 
          SET platform = $1,
              device_model = $2,
              app_version = $3,
              last_ip = $4,
              last_active_at = NOW(),
              updated_at = NOW()
          WHERE user_id = $5 AND device_token = $6
          RETURNING id, user_id, platform, device_model, device_token, app_version, last_ip, last_active_at, created_at, updated_at
        `;
          const result = await client.query(updateSql, [
            user_device_data.platform,
            user_device_data.device_model,
            user_device_data.app_version,
            user_device_data.last_ip,
            user_device_data.user_id,
            user_device_data.device_token,
          ]);
          return result.rows[0];
        }
      }

      // Nếu chưa tồn tại thì tạo mới
      const allowedFields = [
        "user_id",
        "platform",
        "device_model",
        "device_token",
        "app_version",
        "last_ip",
      ];

      const columns = Object.keys(user_device_data).filter((key) =>
        allowedFields.includes(key)
      );
      const values = columns.map((key) => user_device_data[key]);
      const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

      if (columns.length === 0) {
        throw new Error("No valid device data provided");
      }

      const sql = `
      INSERT INTO user_devices (${columns.join(", ")})
      VALUES (${placeholders})
      RETURNING id, user_id, platform, device_model, device_token, app_version, last_ip, last_active_at, created_at, updated_at
    `;

      const result = await client.query(sql, values);
      return result.rows[0];
    });
  }

  /**
   * get all device of user (lấy danh sách thiết bị của mình)
   */
  async getMyDevices(user_id) {
    if (!user_id) {
      throw new Error("User ID is required");
    }

    const sql = `
      SELECT 
        id, 
        user_id, 
        platform, 
        device_model, 
        device_token,
        app_version, 
        last_ip, 
        last_active_at, 
        created_at, 
        updated_at
      FROM user_devices 
      WHERE user_id = $1 
      ORDER BY last_active_at DESC
    `;

    return await DatabaseHelper.getAll(sql, [user_id]);
  }

  /**
   * updateDevice (cập nhật thông tin thiết bị)
   */
  async updateDevice(id, user_device_data) {
    return await DatabaseHelper.transaction(async (client) => {
      console.log(id);
      console.log(user_device_data);
      // Kiểm tra device có tồn tại không
      const existingDevice = await client.query(
        `SELECT id, user_id FROM user_devices WHERE id = $1`,
        [id]
      );
      // console.log(existingDevice);

      if (existingDevice.rows.length === 0) {
        throw new Error("Device not found");
      }

      const allowedFields = [
        "platform",
        "device_model",
        "device_token",
        "app_version",
        "last_ip",
        "last_active_at",
      ];

      const columns = Object.keys(user_device_data).filter((key) =>
        allowedFields.includes(key)
      );
      const values = columns.map((key) => user_device_data[key]);
      const setClause = columns
        .map((col, index) => `${col} = $${index + 1}`)
        .join(", ");

      if (columns.length === 0) {
        throw new Error("No valid fields provided for update");
      }

      const sql = `
        UPDATE user_devices
        SET ${setClause}, updated_at = NOW()
        WHERE id = $${values.length + 1}
        RETURNING id, user_id, platform, device_model, device_token, app_version, last_ip, last_active_at, created_at, updated_at
      `;

      const result = await client.query(sql, [...values, id]);
      return result.rows[0];
    });
  }

  /**
   * getUsersByInterest (lấy danh sách user theo interest)
   * @param {Object} interestData - Object chứa interest_id và name, ví dụ: { interest_id: 1, name: "Hiking" }
   */
  async getUsersByInterest(interestData) {
    return await DatabaseHelper.getAll(
      `SELECT u.*, p.*
      FROM users u
      JOIN profiles p ON u.id = p.user_id
      JOIN profile_interests pi ON u.id = pi.user_id
      JOIN interests i ON pi.interest_id = i.id
      WHERE i.id = $1`,
      [interestData.interest_id]
    );
  }

  /**
   * getUsersByGoal (lấy danh sách user theo goal)
   * @param {Object} goalData - Object chứa goal_id và name, ví dụ: { goal_id: 1, name: "Long-term relationship" }
   */
  async getUsersByGoal(goalData) {
    return await DatabaseHelper.getAll(
      `SELECT u.*, p.*
      FROM users u
      JOIN profiles p ON u.id = p.user_id
      JOIN profile_goals pg ON u.id = pg.user_id
      JOIN goals g ON pg.goal_id = g.id
      WHERE g.id = $1`,
      [goalData.goal_id]
    );
  }
}

module.exports = UserModel;
