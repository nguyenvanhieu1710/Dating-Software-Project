const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class InterestModel extends BaseModel {
  constructor() {
    super("interests", "id");
  }

  /**
   * Find all interests with pagination
   */
  async findAll({ page = 1, limit = 10 } = {}) {
    return await DatabaseHelper.transaction(async (client) => {
      const offset = (page - 1) * limit;
      const sql = `
        SELECT * FROM interests
        ORDER BY name
        LIMIT $1 OFFSET $2
      `;
      const countSql = `SELECT COUNT(*) FROM interests`;
      
      const [result, countResult] = await Promise.all([
        client.query(sql, [limit, offset]),
        client.query(countSql)
      ]);

      return {
        data: result.rows,
        pagination: {
          total: parseInt(countResult.rows[0].count),
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(countResult.rows[0].count / limit)
        }
      };
    });
  }

  /**
   * Find interest by ID
   */
  async findById(id) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        SELECT * FROM interests 
        WHERE id = $1
      `;
      const result = await client.query(sql, [id]);
      return result.rows[0] || null;
    });
  }

  /**
   * Search interests by keyword
   */
  async search(keyword) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        SELECT * FROM interests 
        WHERE name ILIKE $1 
        ORDER BY name
        LIMIT 20
      `;
      const result = await client.query(sql, [`%${keyword}%`]);
      return result.rows;
    });
  }

  /**
   * Create a new interest
   */
  async create({ name, category }) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        INSERT INTO interests (name, category)
        VALUES ($1, $2)
        RETURNING *
      `;
      const result = await client.query(sql, [name, category]);
      return result.rows[0];
    });
  }

  /**
   * Update an interest
   */
  async update(id, updateData) {
    return await DatabaseHelper.transaction(async (client) => {
      const { name, category } = updateData;
      const sql = `
        UPDATE interests 
        SET name = $1, 
            category = $2            
        WHERE id = $3
        RETURNING *
      `;
      const result = await client.query(sql, [name, category, id]);
      return result.rows[0] || null;
    });
  }

  /**
   * Soft delete an interest
   */
  async softDelete(id) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = ``;
      const result = await client.query(sql, [id]);
      return result.rows[0] || null;
    });
  }
}

module.exports = InterestModel;
