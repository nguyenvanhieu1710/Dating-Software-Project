const pool = require("./index");

class DatabaseHelper {
  /**
   * Thực hiện query với parameters
   * @param {string} text - SQL query
   * @param {Array} params - Parameters cho query
   * @returns {Promise} - Promise với kết quả
   */
  static async query(text, params = []) {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log("📊 Executed query", { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error("❌ Database query error:", error);
      throw error;
    }
  }

  /**
   * Lấy một row duy nhất
   * @param {string} text - SQL query
   * @param {Array} params - Parameters cho query
   * @returns {Promise} - Promise với row đầu tiên
   */
  static async getOne(text, params = []) {
    const res = await this.query(text, params);
    return res.rows[0];
  }

  /**
   * Lấy tất cả rows
   * @param {string} text - SQL query
   * @param {Array} params - Parameters cho query
   * @returns {Promise} - Promise với tất cả rows
   */
  static async getAll(text, params = []) {
    const res = await this.query(text, params);
    return res.rows;
  }

  /**
   * Thực hiện transaction
   * @param {Function} callback - Function chứa các queries trong transaction
   * @returns {Promise} - Promise với kết quả
   */
  static async transaction(callback) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Kiểm tra kết nối database
   * @returns {Promise<boolean>} - True nếu kết nối thành công
   */
  static async testConnection() {
    try {
      await this.query("SELECT NOW()");
      return true;
    } catch (error) {
      console.error("❌ Database connection test failed:", error);
      return false;
    }
  }
}

module.exports = DatabaseHelper;
