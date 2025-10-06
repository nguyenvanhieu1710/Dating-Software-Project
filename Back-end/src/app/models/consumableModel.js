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
   * Get All
   */
  async getAllConsumables() {
    const sql = `SELECT * FROM consumables`;
    return await DatabaseHelper.getAll(sql);
  }

  /**
   * Create
   */
  async createConsumable(consumableData){
    // console.log(consumableData);    
    return await DatabaseHelper.transaction(async (client) => {
      const user = await this.findByUserId(consumableData.user_id);
      if(user){
        return await this.updateConsumable(consumableData.user_id, consumableData);
      }
      
      const sql = `
        INSERT INTO consumables (
          user_id, super_likes_balance, boosts_balance, last_super_like_reset
        ) VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      return await client.query(sql, [
        consumableData.user_id,
        consumableData.super_likes_balance,
        consumableData.boosts_balance,
        consumableData.last_super_like_reset,
      ]);
    });
  }

  /**
   * updateConsumable
   */
  async updateConsumable(userId, consumableData) {
    return await DatabaseHelper.transaction(async (client) => {
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

      return await client.query(sql, [
        userId,
        consumableData.super_likes_balance,
        consumableData.boosts_balance,
        consumableData.last_super_like_reset,
      ]);
    });
  }

  /**
   * Xóa consumable
   */
  async deleteConsumable(userId) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
      DELETE FROM consumables 
      WHERE user_id = $1
      RETURNING *
    `;
      return await client.query(sql, [userId]);
    });
  }
}

module.exports = ConsumableModel;
