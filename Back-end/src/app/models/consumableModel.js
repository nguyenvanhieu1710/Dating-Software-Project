const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class ConsumableModel extends BaseModel {
  constructor() {
    super("consumables", "user_id");
  }

  /**
   * Lấy consumables của user
   */
  async findByUserId(userId) {
    const sql = `SELECT * FROM consumables WHERE user_id = $1`;
    return await DatabaseHelper.getOne(sql, [userId]);
  }

  /**
   * Tạo hoặc cập nhật consumables
   */
  async upsertConsumables(userId, consumableData) {
    const existing = await this.findByUserId(userId);
    
    if (existing) {
      return await this.updateConsumables(userId, consumableData);
    } else {
      return await this.createConsumables(userId, consumableData);
    }
  }

  /**
   * Tạo consumables mới
   */
  async createConsumables(userId, consumableData) {
    const sql = `
      INSERT INTO consumables (
        user_id, super_likes_balance, boosts_balance, last_super_like_reset
      ) VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [
      userId,
      consumableData.super_likes_balance || 0,
      consumableData.boosts_balance || 0,
      consumableData.last_super_like_reset || new Date()
    ];

    return await DatabaseHelper.getOne(sql, values);
  }

  /**
   * Cập nhật consumables
   */
  async updateConsumables(userId, consumableData) {
    const sql = `
      UPDATE consumables 
      SET 
        super_likes_balance = COALESCE($2, super_likes_balance),
        boosts_balance = COALESCE($3, boosts_balance),
        last_super_like_reset = COALESCE($4, last_super_like_reset),
        updated_at = NOW()
      WHERE user_id = $1
      RETURNING *
    `;
    
    const values = [
      userId,
      consumableData.super_likes_balance,
      consumableData.boosts_balance,
      consumableData.last_super_like_reset
    ];

    return await DatabaseHelper.getOne(sql, values);
  }

  /**
   * Sử dụng super like
   */
  async useSuperLike(userId) {
    const sql = `
      UPDATE consumables 
      SET super_likes_balance = super_likes_balance - 1
      WHERE user_id = $1 AND super_likes_balance > 0
      RETURNING *
    `;
    return await DatabaseHelper.getOne(sql, [userId]);
  }

  /**
   * Sử dụng boost
   */
  async useBoost(userId) {
    const sql = `
      UPDATE consumables 
      SET boosts_balance = boosts_balance - 1
      WHERE user_id = $1 AND boosts_balance > 0
      RETURNING *
    `;
    return await DatabaseHelper.getOne(sql, [userId]);
  }

  /**
   * Thêm super likes
   */
  async addSuperLikes(userId, amount) {
    const sql = `
      UPDATE consumables 
      SET super_likes_balance = super_likes_balance + $2
      WHERE user_id = $1
      RETURNING *
    `;
    return await DatabaseHelper.getOne(sql, [userId, amount]);
  }

  /**
   * Thêm boosts
   */
  async addBoosts(userId, amount) {
    const sql = `
      UPDATE consumables 
      SET boosts_balance = boosts_balance + $2
      WHERE user_id = $1
      RETURNING *
    `;
    return await DatabaseHelper.getOne(sql, [userId, amount]);
  }

  /**
   * Reset super likes hàng ngày
   */
  async resetDailySuperLikes(userId) {
    const sql = `
      UPDATE consumables 
      SET 
        super_likes_balance = 1,
        last_super_like_reset = NOW()
      WHERE user_id = $1 
        AND (last_super_like_reset IS NULL 
             OR last_super_like_reset < NOW() - INTERVAL '1 day')
      RETURNING *
    `;
    return await DatabaseHelper.getOne(sql, [userId]);
  }

  /**
   * Kiểm tra có thể sử dụng super like không
   */
  async canUseSuperLike(userId) {
    const consumables = await this.findByUserId(userId);
    if (!consumables) return false;
    
    // Reset daily super likes nếu cần
    await this.resetDailySuperLikes(userId);
    
    const updatedConsumables = await this.findByUserId(userId);
    return updatedConsumables && updatedConsumables.super_likes_balance > 0;
  }

  /**
   * Kiểm tra có thể sử dụng boost không
   */
  async canUseBoost(userId) {
    const consumables = await this.findByUserId(userId);
    return consumables && consumables.boosts_balance > 0;
  }

  /**
   * Lấy thống kê consumables
   */
  async getConsumableStats() {
    const sql = `
      SELECT 
        SUM(super_likes_balance) as total_super_likes,
        SUM(boosts_balance) as total_boosts,
        COUNT(*) as total_users_with_consumables
      FROM consumables
    `;
    return await DatabaseHelper.getOne(sql);
  }
}

module.exports = ConsumableModel; 