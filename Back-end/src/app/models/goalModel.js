const BaseModel = require('./BaseModel');
const DatabaseHelper = require('../../config/database/queryHelper');

class GoalModel extends BaseModel {
  constructor() {
    super('goals', 'id');
  }

  /**
   * Find all goals with pagination
   */
  async findAll({ page = 1, limit = 10 } = {}) {
    return await DatabaseHelper.transaction(async (client) => {
      const offset = (page - 1) * limit;
      const sql = `
        SELECT * FROM goals
        ORDER BY name
        LIMIT $1 OFFSET $2
      `;
      const countSql = `SELECT COUNT(*) FROM goals`;
      
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
   * Find goal by ID
   */
  async findById(id) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        SELECT * FROM goals 
        WHERE id = $1
      `;
      const result = await client.query(sql, [id]);
      return result.rows[0] || null;
    });
  }

  /**
   * Search goals by keyword
   */
  async search(keyword) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        SELECT * FROM goals 
        WHERE name ILIKE $1 
        ORDER BY name
        LIMIT 20
      `;
      const result = await client.query(sql, [`%${keyword}%`]);
      return result.rows;
    });
  }

  /**
   * Create a new goal
   */
  async create(goalData) {
    return await DatabaseHelper.transaction(async (client) => {
      const { name } = goalData;
      const sql = `
        INSERT INTO goals (name)
        VALUES ($1)
        RETURNING *
      `;
      const result = await client.query(sql, [name]);
      return result.rows[0];
    });
  }

  /**
   * Update a goal
   */
  async update(id, updateData) {
    return await DatabaseHelper.transaction(async (client) => {
      const { name } = updateData;
      const sql = `
        UPDATE goals 
        SET name = $1
        WHERE id = $2
        RETURNING *
      `;
      const result = await client.query(sql, [name, id]);
      return result.rows[0] || null;
    });
  }

  /**
   * Soft delete a goal
   */
  async softDelete(id) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = ``;
      const result = await client.query(sql, [id]);
      return result.rows[0] || null;
    });
  }
}

module.exports = GoalModel;
