const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class SettingsModel extends BaseModel {
  constructor() {
    super("settings", "user_id");
  }

  /**
   * Lấy tất cả settings
   */
  async getAllSettings() {
    const sql = `SELECT * FROM settings`;
    return await DatabaseHelper.getAll(sql);
  }

  /**
   * Lấy settings theo user_id
   */
  async findByUserId(userId) {
    const sql = `SELECT * FROM settings WHERE user_id = $1`;
    return await DatabaseHelper.getOne(sql, [userId]);
  }

  /**
   * Tạo settings mới
   */
  async createSettings(settingsData) {
    return await DatabaseHelper.transaction(async (client) => {
      const user_id = settingsData.user_id;
      const findSettings = await this.findByUserId(user_id);
      if (findSettings) {
        return await this.updateSettings(settingsData.user_id, settingsData);
      }
      const sql = `
        INSERT INTO settings (
          user_id, preferred_gender, min_age, max_age, max_distance_km, show_me,
          is_discoverable, hide_age, hide_distance, show_last_active, show_online_status,
          block_messages_from_strangers, new_matches_notification, new_messages_notification,
          message_likes_notification, message_super_likes_notification, profile_views_notification,
          email_notifications, push_notifications, promotional_emails,
          language, theme, account_type, verification_status, preferences,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11,
          $12, $13, $14,
          $15, $16, $17,
          $18, $19, $20,
          $21, $22, $23, $24, $25,
          NOW(), NOW()
        )
        RETURNING *
      `;

      const values = [
        settingsData.user_id,
        settingsData.preferred_gender || null,
        settingsData.min_age || 18,
        settingsData.max_age || 55,
        settingsData.max_distance_km || 50,
        settingsData.show_me || ["male", "female", "other"],
        settingsData.is_discoverable !== false,
        settingsData.hide_age || false,
        settingsData.hide_distance || false,
        settingsData.show_last_active || true,
        settingsData.show_online_status || true,
        settingsData.block_messages_from_strangers || false,
        settingsData.new_matches_notification !== false,
        settingsData.new_messages_notification !== false,
        settingsData.message_likes_notification !== false,
        settingsData.message_super_likes_notification !== false,
        settingsData.profile_views_notification !== false,
        settingsData.email_notifications !== false,
        settingsData.push_notifications !== false,
        settingsData.promotional_emails !== false,
        settingsData.language || "en",
        settingsData.theme || "system",
        settingsData.account_type || "free",
        settingsData.verification_status || "pending",
        settingsData.preferences || {},
      ];

      // return await client.getOne(sql, values);
      const result = await client.query(sql, values);
      return result.rows[0];
    });
  }

  /**
   * Cập nhật settings
   */
  async updateSettings(userId, settingsData) {
    const sql = `
      UPDATE settings 
      SET 
        preferred_gender = COALESCE($2, preferred_gender),
        min_age = COALESCE($3, min_age),
        max_age = COALESCE($4, max_age),
        max_distance_km = COALESCE($5, max_distance_km),
        show_me = COALESCE($6, show_me),
        is_discoverable = COALESCE($7, is_discoverable),
        hide_age = COALESCE($8, hide_age),
        hide_distance = COALESCE($9, hide_distance),
        show_last_active = COALESCE($10, show_last_active),
        show_online_status = COALESCE($11, show_online_status),
        block_messages_from_strangers = COALESCE($12, block_messages_from_strangers),
        new_matches_notification = COALESCE($13, new_matches_notification),
        new_messages_notification = COALESCE($14, new_messages_notification),
        message_likes_notification = COALESCE($15, message_likes_notification),
        message_super_likes_notification = COALESCE($16, message_super_likes_notification),
        profile_views_notification = COALESCE($17, profile_views_notification),
        email_notifications = COALESCE($18, email_notifications),
        push_notifications = COALESCE($19, push_notifications),
        promotional_emails = COALESCE($20, promotional_emails),
        language = COALESCE($21, language),
        theme = COALESCE($22, theme),
        account_type = COALESCE($23, account_type),
        verification_status = COALESCE($24, verification_status),
        preferences = COALESCE($25, preferences),
        updated_at = NOW()
      WHERE user_id = $1
      RETURNING *
    `;

    const values = [
      userId,
      settingsData.preferred_gender,
      settingsData.min_age || 18,
      settingsData.max_age || 55,
      settingsData.max_distance_km || 50,
      settingsData.show_me || ["male", "female", "other"],
      settingsData.is_discoverable || true,
      settingsData.hide_age || false,
      settingsData.hide_distance || false,
      settingsData.show_last_active || true,
      settingsData.show_online_status || true,
      settingsData.block_messages_from_strangers || false,
      settingsData.new_matches_notification || true,
      settingsData.new_messages_notification || true,
      settingsData.message_likes_notification || true,
      settingsData.message_super_likes_notification || true,
      settingsData.profile_views_notification || true,
      settingsData.email_notifications || true,
      settingsData.push_notifications || true,
      settingsData.promotional_emails || false,
      settingsData.language || "en",
      settingsData.theme || "system",
      settingsData.account_type || "free",
      settingsData.verification_status || "pending",
      settingsData.preferences || {},
    ];
    

    return await DatabaseHelper.getOne(sql, values);
  }

  /**
   * Reset settings về mặc định
   */
  async resetToDefault(userId) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        UPDATE settings
        SET
          preferred_gender = NULL,
          min_age = 18,
          max_age = 55,
          max_distance_km = 50,
          show_me = '{"male","female","other"}',
          is_discoverable = true,
          hide_age = false,
          hide_distance = false,
          show_last_active = true,
          show_online_status = true,
          block_messages_from_strangers = false,
          new_matches_notification = true,
          new_messages_notification = true,
          message_likes_notification = true,
          message_super_likes_notification = true,
          profile_views_notification = true,
          email_notifications = true,
          push_notifications = true,
          promotional_emails = false,
          language = 'en',
          theme = 'system',
          account_type = 'free',
          verification_status = 'pending',
          preferences = '{}'::jsonb,
          updated_at = NOW()
        WHERE user_id = $1
        RETURNING *
      `;
      return await client.getOne(sql, [userId]);
    });
  }
}

module.exports = SettingsModel;
