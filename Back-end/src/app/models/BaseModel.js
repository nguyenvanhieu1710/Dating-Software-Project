const DatabaseHelper = require("../../config/database/queryHelper");

class BaseModel {
  constructor(tableName, primaryKey = "id") {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
  }

  /**
   * Lấy tất cả records
   * @param {Object} options - Options cho query
   * @returns {Promise<Array>} - Danh sách records
   */
  async findAll(options = {}) {
    const { where = "", params = [], orderBy = "", limit = "" } = options;

    let sql = `SELECT * FROM ${this.tableName}`;
    if (where) sql += ` WHERE ${where}`;
    if (orderBy) sql += ` ORDER BY ${orderBy}`;
    if (limit) sql += ` LIMIT ${limit}`;

    return await DatabaseHelper.getAll(sql, params);
  }

  /**
   * Lấy record theo ID
   * @param {number|string} id - ID của record
   * @returns {Promise<Object|null>} - Record hoặc null
   */
  async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = $1`;
    return await DatabaseHelper.getOne(sql, [id]);
  }

  /**
   * Tạo record mới
   * @param {Object} data - Data để insert
   * @returns {Promise<Object>} - Kết quả insert
   */
  async create(data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const sql = `
            INSERT INTO ${this.tableName} (${columns.join(", ")})
            VALUES (${placeholders})
            RETURNING *
        `;

    return await DatabaseHelper.getOne(sql, values);
  }

  /**
   * Cập nhật record
   * @param {number|string} id - ID của record
   * @param {Object} data - Data để update
   * @returns {Promise<Object|null>} - Record đã update hoặc null
   */
  async update(id, data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns
      .map((col, index) => `${col} = $${index + 1}`)
      .join(", ");

    const sql = `
            UPDATE ${this.tableName}
            SET ${setClause}
            WHERE ${this.primaryKey} = $${values.length + 1}
            RETURNING *
        `;

    return await DatabaseHelper.getOne(sql, [...values, id]);
  }

  /**
   * Xóa record (soft delete)
   * @param {number|string} id - ID của record
   * @returns {Promise<boolean>} - True nếu xóa thành công
   */
  async delete(id) {
    const sql = `
            UPDATE ${this.tableName}
            SET deleted = true, updated_at = NOW()
            WHERE ${this.primaryKey} = $1
        `;

    const result = await DatabaseHelper.query(sql, [id]);
    return result.rowCount > 0;
  }

  /**
   * Xóa record vĩnh viễn
   * @param {number|string} id - ID của record
   * @returns {Promise<boolean>} - True nếu xóa thành công
   */
  async destroy(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = $1`;
    const result = await DatabaseHelper.query(sql, [id]);
    return result.rowCount > 0;
  }

  /**
   * Tìm kiếm với điều kiện
   * @param {Object} conditions - Điều kiện tìm kiếm
   * @returns {Promise<Array>} - Danh sách records
   */
  async findWhere(conditions) {
    const whereClause = Object.keys(conditions)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(" AND ");

    const sql = `SELECT * FROM ${this.tableName} WHERE ${whereClause}`;
    return await DatabaseHelper.getAll(sql, Object.values(conditions));
  }

  /**
   * Đếm số records
   * @param {Object} options - Options cho query
   * @returns {Promise<number>} - Số lượng records
   */
  async count(options = {}) {
    const { where = "", params = [] } = options;

    let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    if (where) sql += ` WHERE ${where}`;

    const result = await DatabaseHelper.getOne(sql, params);
    return parseInt(result.count);
  }
}

module.exports = BaseModel;
