const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class SwipeModel extends BaseModel {
  constructor() {
    super("swipes", "id");
  }

  /**
   * Tạo swipe mới
   */
  async createSwipe(swipeData) {
    const sql = `
      INSERT INTO swipes (swiper_user_id, swiped_user_id, action)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [
      swipeData.swiper_user_id,
      swipeData.swiped_user_id,
      swipeData.action,
    ];

    return await DatabaseHelper.getOne(sql, values);
  }

  /**
   * Kiểm tra xem đã swipe chưa
   */
  async hasSwiped(swiperUserId, swipedUserId) {
    const sql = `
      SELECT * FROM swipes 
      WHERE swiper_user_id = $1 AND swiped_user_id = $2
    `;
    return await DatabaseHelper.getOne(sql, [swiperUserId, swipedUserId]);
  }

  /**
   * Lấy danh sách người đã swipe (Lấy danh sách người mà mình đã vuốt)
   */
  async getSwipedUsers(userId, action = null) {
    let sql = `
      SELECT s.*, p.first_name, p.dob, p.gender, p.bio, p.job_title, p.school,
             ph.url as photo_url
      FROM swipes s
      JOIN profiles p ON s.swiped_user_id = p.user_id
      LEFT JOIN photos ph ON p.user_id = ph.user_id AND ph.order_index = 0
      WHERE s.swiper_user_id = $1
    `;

    const params = [userId];

    if (action) {
      sql += ` AND s.action = $2`;
      params.push(action);
    }

    sql += ` ORDER BY s.created_at DESC`;

    return await DatabaseHelper.getAll(sql, params);
  }

  /**
   * Lấy danh sách người đã swipe mình (Lấy danh sách người đã vuốt mình)
   */
  async getSwipedByUsers(userId, action = null) {
    let sql = `
      SELECT s.*, p.first_name, p.dob, p.gender, p.bio, p.job_title, p.school,
             ph.url as photo_url
      FROM swipes s
      JOIN profiles p ON s.swiper_user_id = p.user_id
      LEFT JOIN (
        SELECT DISTINCT ON (user_id) user_id, url
        FROM photos
        ORDER BY user_id, order_index
      ) ph ON p.user_id = ph.user_id
      WHERE s.swiped_user_id = $1
      `;

    const params = [userId];

    if (action) {
      sql += ` AND s.action = $2`;
      params.push(action);
    }

    sql += ` ORDER BY s.created_at DESC`;

    return await DatabaseHelper.getAll(sql, params);
  }

  /**
   * Lấy thống kê swipe
   */
  async getSwipeStats(userId) {
    const sql = `
      SELECT 
        action,
        COUNT(*) as count
      FROM swipes 
      WHERE swiper_user_id = $1
      GROUP BY action
    `;
    return await DatabaseHelper.getAll(sql, [userId]);
  }

  /**
   * Lấy danh sách potential matches (người chưa swipe)
   */
  async getPotentialMatches(userId, limit = 20) {
    const sql = `
      SELECT 
        p.*, u.email, u.phone_number,
        ph.url as photo_url
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN photos ph ON p.user_id = ph.user_id AND ph.order_index = 0
      WHERE u.status = 'active' 
        AND p.user_id != $1
        AND p.user_id NOT IN (
          SELECT swiped_user_id 
          FROM swipes 
          WHERE swiper_user_id = $1
        )
      ORDER BY p.popularity_score DESC, p.last_active_at DESC
      LIMIT $2
    `;

    return await DatabaseHelper.getAll(sql, [userId, limit]);
  }

  /**
   * Xóa swipe (undo)
   */
  async deleteSwipe(swiperUserId, swipedUserId) {
    const sql = `
      DELETE FROM swipes 
      WHERE swiper_user_id = $1 AND swiped_user_id = $2
    `;
    const result = await DatabaseHelper.query(sql, [
      swiperUserId,
      swipedUserId,
    ]);
    return result.rowCount > 0;
  }

  /**
   * Lấy tất cả swipes với phân trang và lọc tùy chọn
   */
  async getAllSwipes(page = 1, limit = 20, filters = {}) {
    const offset = (page - 1) * limit;
    let whereClause = [];
    const params = [];
    let paramIndex = 1;

    // Thêm các điều kiện lọc nếu có
    if (filters.swiper_user_id) {
      whereClause.push(`swiper_user_id = $${paramIndex++}`);
      params.push(filters.swiper_user_id);
    }
    if (filters.swiped_user_id) {
      whereClause.push(`swiped_user_id = $${paramIndex++}`);
      params.push(filters.swiped_user_id);
    }
    if (filters.action) {
      whereClause.push(`action = $${paramIndex++}`);
      params.push(filters.action);
    }

    // Xây dựng câu truy vấn
    let sql = `
      SELECT s.*, 
             u1.email as swiper_email,
             u2.email as swiped_email,
             p1.first_name as swiper_name,
             p2.first_name as swiped_name
      FROM swipes s
      JOIN users u1 ON s.swiper_user_id = u1.id
      JOIN users u2 ON s.swiped_user_id = u2.id
      LEFT JOIN profiles p1 ON s.swiper_user_id = p1.user_id
      LEFT JOIN profiles p2 ON s.swiped_user_id = p2.user_id
    `;

    // Thêm điều kiện WHERE nếu có
    if (whereClause.length > 0) {
      sql += ` WHERE ${whereClause.join(" AND ")}`;
    }

    // Thêm phân trang
    sql += ` ORDER BY s.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    // Lấy tổng số bản ghi
    let countSql = `SELECT COUNT(*) as total FROM swipes`;
    if (whereClause.length > 0) {
      countSql += ` WHERE ${whereClause.join(" AND ")}`;
    }

    const [swipes, totalResult] = await Promise.all([
      DatabaseHelper.getAll(sql, params),
      DatabaseHelper.getOne(countSql, params.slice(0, -2)), // Bỏ 2 tham số limit và offset
    ]);

    return {
      data: swipes,
      pagination: {
        total: parseInt(totalResult.total, 10),
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalResult.total / limit),
      },
    };
  }
}

module.exports = SwipeModel;
