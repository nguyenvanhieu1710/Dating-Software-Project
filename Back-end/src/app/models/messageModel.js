const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class MessageModel extends BaseModel {
  constructor() {
    super("messages", "id");
  }

  /**
   * Gửi tin nhắn mới với validation
   */
  async sendMessage(messageData) {
    const sql = `
      INSERT INTO messages (match_id, sender_id, content, message_type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [
      messageData.match_id,
      messageData.sender_id,
      messageData.content,
      messageData.message_type || 'text'
    ];

    return await DatabaseHelper.getOne(sql, values);
  }

  /**
   * Lấy tin nhắn của một match với pagination và optimization
   */
  async getMessagesByMatchId(matchId, userId, limit = 50, offset = 0) {
    const sql = `
      SELECT 
        m.*,
        p.first_name, p.dob, p.gender,
        CASE 
          WHEN m.sender_id = $2 THEN 'sent'
          ELSE 'received'
        END as message_direction
      FROM messages m
      JOIN profiles p ON m.sender_id = p.user_id
      WHERE m.match_id = $1
      ORDER BY m.sent_at ASC
      LIMIT $3 OFFSET $4
    `;
    
    return await DatabaseHelper.getAll(sql, [matchId, userId, limit, offset]);
  }

  /**
   * Đánh dấu tin nhắn đã đọc
   */
  async markAsRead(messageId, userId) {
    const sql = `
      UPDATE messages 
      SET read_at = NOW() 
      WHERE id = $1 AND sender_id != $2 AND read_at IS NULL
    `;
    return await DatabaseHelper.query(sql, [messageId, userId]);
  }

  /**
   * Đánh dấu tất cả tin nhắn trong match đã đọc
   */
  async markAllAsRead(matchId, userId) {
    const sql = `
      UPDATE messages 
      SET read_at = NOW() 
      WHERE match_id = $1 AND sender_id != $2 AND read_at IS NULL
    `;
    return await DatabaseHelper.query(sql, [matchId, userId]);
  }

  /**
   * Đếm tin nhắn chưa đọc với optimization
   */
  async countUnreadMessages(userId) {
    const sql = `
      SELECT 
        m.match_id,
        COUNT(*) as unread_count,
        MAX(m.sent_at) as last_message_time
      FROM messages m
      JOIN matches mt ON m.match_id = mt.id
      WHERE (mt.user1_id = $1 OR mt.user2_id = $1)
        AND m.sender_id != $1
        AND m.read_at IS NULL
      GROUP BY m.match_id
      ORDER BY last_message_time DESC
    `;
    return await DatabaseHelper.getAll(sql, [userId]);
  }

  /**
   * Lấy tin nhắn cuối cùng của mỗi match với sender info
   */
  async getLastMessagesByUserId(userId) {
    const sql = `
      SELECT DISTINCT ON (m.match_id)
        m.*,
        p.first_name, p.dob, p.gender,
        mt.id as match_id,
        mt.user1_id, mt.user2_id,
        CASE 
          WHEN mt.user1_id = $1 THEN mt.user2_id
          ELSE mt.user1_id
        END as other_user_id,
        other_p.first_name as other_user_name,
        other_p.dob as other_user_dob,
        other_p.gender as other_user_gender
      FROM messages m
      JOIN matches mt ON m.match_id = mt.id
      JOIN profiles p ON m.sender_id = p.user_id
      JOIN profiles other_p ON (
        CASE 
          WHEN mt.user1_id = $1 THEN mt.user2_id
          ELSE mt.user1_id
        END = other_p.user_id
      )
      WHERE (mt.user1_id = $1 OR mt.user2_id = $1)
      ORDER BY m.match_id, m.sent_at DESC
    `;
    return await DatabaseHelper.getAll(sql, [userId]);
  }

  /**
   * Xóa tin nhắn (soft delete)
   */
  async deleteMessage(messageId, userId) {
    const sql = `
      UPDATE messages 
      SET deleted_at = NOW() 
      WHERE id = $1 AND sender_id = $2
    `;
    const result = await DatabaseHelper.query(sql, [messageId, userId]);
    return result.rowCount > 0;
  }

  /**
   * Tìm kiếm tin nhắn với full-text search
   */
  async searchMessages(matchId, keyword) {
    const sql = `
      SELECT 
        m.*,
        p.first_name, p.dob, p.gender
      FROM messages m
      JOIN profiles p ON m.sender_id = p.user_id
      WHERE m.match_id = $1 
        AND m.content ILIKE $2
      ORDER BY m.sent_at DESC
    `;
    return await DatabaseHelper.getAll(sql, [matchId, `%${keyword}%`]);
  }

  /**
   * Lấy thống kê tin nhắn
   */
  async getMessageStats(userId) {
    const sql = `
      SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN sender_id = $1 THEN 1 END) as sent_messages,
        COUNT(CASE WHEN sender_id != $1 THEN 1 END) as received_messages,
        COUNT(CASE WHEN read_at IS NULL AND sender_id != $1 THEN 1 END) as unread_messages,
        COUNT(DISTINCT match_id) as active_conversations,
        MAX(sent_at) as last_message_time
      FROM messages m
      JOIN matches mt ON m.match_id = mt.id
      WHERE (mt.user1_id = $1 OR mt.user2_id = $1)
    `;
    
    const stats = await DatabaseHelper.getOne(sql, [userId]);
    
    // Get recent activity
    const recentActivitySql = `
      SELECT 
        DATE(sent_at) as date,
        COUNT(*) as message_count
      FROM messages m
      JOIN matches mt ON m.match_id = mt.id
      WHERE (mt.user1_id = $1 OR mt.user2_id = $1)
        AND m.sent_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(sent_at)
      ORDER BY date DESC
      LIMIT 30
    `;
    
    const recentActivity = await DatabaseHelper.getAll(recentActivitySql, [userId]);
    
    return {
      ...stats,
      recent_activity: recentActivity
    };
  }

  /**
   * Lấy tin nhắn theo khoảng thời gian
   */
  async getMessagesByDateRange(matchId, startDate, endDate) {
    const sql = `
      SELECT 
        m.*,
        p.first_name, p.dob, p.gender
      FROM messages m
      JOIN profiles p ON m.sender_id = p.user_id
      WHERE m.match_id = $1 
        AND m.sent_at BETWEEN $2 AND $3
      ORDER BY m.sent_at ASC
    `;
    
    return await DatabaseHelper.getAll(sql, [matchId, startDate, endDate]);
  }

  /**
   * Lấy tin nhắn media (hình ảnh, video, file)
   */
  async getMediaMessages(matchId, mediaType = null) {
    let sql = `
      SELECT 
        m.*,
        p.first_name, p.dob, p.gender
      FROM messages m
      JOIN profiles p ON m.sender_id = p.user_id
      WHERE m.match_id = $1 
        AND m.message_type IN ('image', 'video', 'file', 'audio')
    `;
    
    const params = [matchId];
    
    if (mediaType) {
      sql += ` AND m.message_type = $2`;
      params.push(mediaType);
    }
    
    sql += ` ORDER BY m.sent_at DESC`;
    
    return await DatabaseHelper.getAll(sql, params);
  }

  /**
   * Lấy tin nhắn đã pin
   */
  async getPinnedMessages(matchId) {
    const sql = `
      SELECT 
        m.*,
        p.first_name, p.dob, p.gender
      FROM messages m
      JOIN profiles p ON m.sender_id = p.user_id
      WHERE m.match_id = $1 
        AND m.is_pinned = true
      ORDER BY m.pinned_at DESC
    `;
    
    return await DatabaseHelper.getAll(sql, [matchId]);
  }

  /**
   * Pin/Unpin tin nhắn
   */
  async togglePinMessage(messageId, userId) {
    const sql = `
      UPDATE messages 
      SET is_pinned = NOT is_pinned,
          pinned_at = CASE WHEN is_pinned THEN NULL ELSE NOW() END
      WHERE id = $1 AND sender_id = $2
    `;
    
    const result = await DatabaseHelper.query(sql, [messageId, userId]);
    return result.rowCount > 0;
  }

  /**
   * Lấy tin nhắn reactions
   */
  async getMessageReactions(messageId) {
    const sql = `
      SELECT 
        reaction_type,
        COUNT(*) as count,
        ARRAY_AGG(user_id) as users
      FROM message_reactions
      WHERE message_id = $1
      GROUP BY reaction_type
    `;
    
    return await DatabaseHelper.getAll(sql, [messageId]);
  }

  /**
   * Thêm reaction cho tin nhắn
   */
  async addReaction(messageId, userId, reactionType) {
    const sql = `
      INSERT INTO message_reactions (message_id, user_id, reaction_type)
      VALUES ($1, $2, $3)
      ON CONFLICT (message_id, user_id) 
      DO UPDATE SET reaction_type = $3, created_at = NOW()
    `;
    
    return await DatabaseHelper.query(sql, [messageId, userId, reactionType]);
  }

  /**
   * Xóa reaction
   */
  async removeReaction(messageId, userId) {
    const sql = `
      DELETE FROM message_reactions 
      WHERE message_id = $1 AND user_id = $2
    `;
    
    const result = await DatabaseHelper.query(sql, [messageId, userId]);
    return result.rowCount > 0;
  }
}

module.exports = MessageModel; 