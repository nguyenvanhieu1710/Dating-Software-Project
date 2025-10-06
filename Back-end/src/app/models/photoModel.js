const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class PhotoModel extends BaseModel {
  constructor() {
    super("photos", "id");
  }

  /**
   * get all photo
   */
  async getAllPhotos() {
    const sql = `SELECT * FROM photos`;
    return await DatabaseHelper.getAll(sql);
  }

  /**
   * get photo by photoId
   */
  async getPhotoById(photoId) {
    const sql = `SELECT * FROM photos WHERE id = $1`;
    return await DatabaseHelper.getOne(sql, [photoId]);
  }

  /**
   * Lấy tất cả ảnh của user
   */
  async findByUserId(userId) {
    const sql = `
      SELECT * FROM photos 
      WHERE user_id = $1 
      ORDER BY order_index ASC, created_at ASC
    `;
    return await DatabaseHelper.getAll(sql, [userId]);
  }

  /**
   * Thêm ảnh mới
   */
  async addPhoto(photoData) {
    const sql = `
      INSERT INTO photos (user_id, url, order_index)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [
      photoData.user_id,
      photoData.url,
      photoData.order_index || 0
    ];

    return await DatabaseHelper.getOne(sql, values);
  }

  /**
   * Cập nhật thứ tự ảnh
   */
  async updatePhotoOrder(photoId, orderIndex) {
    const sql = `
      UPDATE photos 
      SET order_index = $2 
      WHERE id = $1
      RETURNING *
    `;
    return await DatabaseHelper.getOne(sql, [photoId, orderIndex]);
  }

  /**
   * Xóa ảnh
   */
  async deletePhoto(photoId, userId) {
    const sql = `
      DELETE FROM photos 
      WHERE id = $1 AND user_id = $2
    `;
    console.log("Delete query params:", { photoId, userId, photoIdType: typeof photoId, userIdType: typeof userId });
    
    // Try with original values first
    let result = await DatabaseHelper.query(sql, [photoId, userId]);
    console.log("Delete result (original):", result);
    
    // If no rows affected, try with parsed integers
    if (result.rowCount === 0) {
      console.log("Retrying with parsed integers...");
      result = await DatabaseHelper.query(sql, [parseInt(photoId), parseInt(userId)]);
      console.log("Delete result (parsed):", result);
    }
    
    return result.rowCount > 0;
  }

  /**
   * Đếm số ảnh của user
   */
  async countByUserId(userId) {
    const sql = `SELECT COUNT(*) as count FROM photos WHERE user_id = $1`;
    const result = await DatabaseHelper.getOne(sql, [userId]);
    return parseInt(result.count);
  }

  /**
   * Lấy ảnh đầu tiên của user (avatar)
   */
  async getPrimaryPhoto(userId) {
    const sql = `
      SELECT * FROM photos 
      WHERE user_id = $1 
      ORDER BY order_index ASC, created_at ASC 
      LIMIT 1
    `;
    return await DatabaseHelper.getOne(sql, [userId]);
  }

  /**
   * Lấy ảnh theo ID
   */
  async getPhotoById(photoId) {
    const sql = `SELECT * FROM photos WHERE id = $1`;
    return await DatabaseHelper.getOne(sql, [photoId]);
  }
}

module.exports = PhotoModel;