const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class MatchModel extends BaseModel {
  constructor() {
    super("matches", "id");
  }

  /**
   * Tạo match mới
   */
  async createMatch(user1Id, user2Id) {
    // Đảm bảo user1_id luôn nhỏ hơn user2_id
    const [smallerId, largerId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
    
    const sql = `
      INSERT INTO matches (user1_id, user2_id, status)
      VALUES ($1, $2, 'active')
      RETURNING *
    `;
    
    return await DatabaseHelper.getOne(sql, [smallerId, largerId]);
  }

  /**
   * Kiểm tra xem 2 user đã match chưa
   */
  async checkMatch(user1Id, user2Id) {
    const sql = `
      SELECT * FROM matches 
      WHERE (user1_id = $1 AND user2_id = $2) 
         OR (user1_id = $2 AND user2_id = $1)
    `;
    return await DatabaseHelper.getOne(sql, [user1Id, user2Id]);
  }

  /**
   * Lấy tất cả matches của user
   */
  async getMatchesByUserId(userId) {
    const sql = `
      SELECT 
        m.*,
        CASE 
          WHEN m.user1_id = $1 THEN m.user2_id 
          ELSE m.user1_id 
        END as other_user_id,
        p.first_name, p.dob, p.gender, p.bio, p.job_title, p.school,
        ph.url as photo_url,
        (SELECT COUNT(*) FROM messages WHERE match_id = m.id) as message_count,
        (SELECT MAX(sent_at) FROM messages WHERE match_id = m.id) as last_message_at
      FROM matches m
      JOIN profiles p ON p.user_id = (
        CASE 
          WHEN m.user1_id = $1 THEN m.user2_id 
          ELSE m.user1_id 
        END
      )
      LEFT JOIN photos ph ON p.user_id = ph.user_id AND ph.order_index = 0
      WHERE (m.user1_id = $1 OR m.user2_id = $1) AND m.status = 'active'
      ORDER BY m.created_at DESC
    `;
    
    return await DatabaseHelper.getAll(sql, [userId]);
  }

  /**
   * Lấy match theo ID
   */
  async getMatchById(matchId, userId) {
    const sql = `
      SELECT 
        m.*,
        CASE 
          WHEN m.user1_id = $2 THEN m.user2_id 
          ELSE m.user1_id 
        END as other_user_id,
        p.first_name, p.dob, p.gender, p.bio, p.job_title, p.school,
        ph.url as photo_url
      FROM matches m
      JOIN profiles p ON (
        CASE 
          WHEN m.user1_id = $2 THEN m.user2_id 
          ELSE m.user1_id 
        END = p.user_id
      )
      LEFT JOIN photos ph ON p.user_id = ph.user_id AND ph.order_index = 0
      WHERE m.id = $1 AND (m.user1_id = $2 OR m.user2_id = $2)
    `;
    
    return await DatabaseHelper.getOne(sql, [matchId, userId]);
  }

  /**
   * Unmatch (xóa match)
   */
  async unmatch(matchId, userId) {
    const sql = `
      UPDATE matches 
      SET status = 'unmatched' 
      WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)
      RETURNING *
    `;
    return await DatabaseHelper.getOne(sql, [matchId, userId]);
  }

  /**
   * Lấy thống kê matches
   */
  async getMatchStats(userId) {
    const sql = `
      SELECT 
        COUNT(*) as total_matches,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as matches_this_week,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as matches_this_month
      FROM matches 
      WHERE (user1_id = $1 OR user2_id = $1) AND status = 'active'
    `;
    return await DatabaseHelper.getOne(sql, [userId]);
  }

  /**
   * Kiểm tra mutual match
   */
  async checkMutualMatch(user1Id, user2Id) {
    const sql = `
      SELECT 
        (SELECT COUNT(*) FROM swipes WHERE swiper_user_id = $1 AND swiped_user_id = $2 AND action = 'like') as user1_liked_user2,
        (SELECT COUNT(*) FROM swipes WHERE swiper_user_id = $2 AND swiped_user_id = $1 AND action = 'like') as user2_liked_user1
    `;
    const result = await DatabaseHelper.getOne(sql, [user1Id, user2Id]);
    
    return {
      isMutual: result.user1_liked_user2 > 0 && result.user2_liked_user1 > 0,
      user1LikedUser2: result.user1_liked_user2 > 0,
      user2LikedUser1: result.user2_liked_user1 > 0
    };
  }

  /**
   * Lấy tất cả matches (admin/debug)
   */
  async getAllMatches() {
    const sql = `
      SELECT 
        m.*,
        p1.first_name as user1_name,
        p2.first_name as user2_name,
        (SELECT COUNT(*) FROM messages WHERE match_id = m.id) as message_count,
        (SELECT MAX(sent_at) FROM messages WHERE match_id = m.id) as last_message_at
      FROM matches m
      LEFT JOIN profiles p1 ON m.user1_id = p1.user_id
      LEFT JOIN profiles p2 ON m.user2_id = p2.user_id
      ORDER BY m.created_at DESC
    `;
    
    return await DatabaseHelper.getAll(sql, []);
  }
}

module.exports = MatchModel; 