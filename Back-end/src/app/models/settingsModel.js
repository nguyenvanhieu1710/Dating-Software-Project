const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class SettingsModel extends BaseModel {
  constructor() {
    super("settings", "user_id");
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
    const sql = `
      INSERT INTO settings (
        user_id, preferred_gender, min_age, max_age, 
        max_distance_km, is_discoverable
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      settingsData.user_id,
      settingsData.preferred_gender || 'all',
      settingsData.min_age || 18,
      settingsData.max_age || 55,
      settingsData.max_distance_km || 50,
      settingsData.is_discoverable !== false
    ];

    return await DatabaseHelper.getOne(sql, values);
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
        is_discoverable = COALESCE($6, is_discoverable),
        updated_at = NOW()
      WHERE user_id = $1
      RETURNING *
    `;
    
    const values = [
      userId,
      settingsData.preferred_gender,
      settingsData.min_age,
      settingsData.max_age,
      settingsData.max_distance_km,
      settingsData.is_discoverable
    ];

    return await DatabaseHelper.getOne(sql, values);
  }

  /**
   * Tạo hoặc cập nhật settings
   */
  async upsertSettings(userId, settingsData) {
    const existingSettings = await this.findByUserId(userId);
    
    if (existingSettings) {
      return await this.updateSettings(userId, settingsData);
    } else {
      return await this.createSettings({ user_id: userId, ...settingsData });
    }
  }
}

module.exports = SettingsModel; 