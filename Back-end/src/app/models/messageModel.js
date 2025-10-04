const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class MessageModel extends BaseModel {
  constructor() {
    super("messages", "id");
  }

  /**
   * Lấy tất cả tin nhắn của user (có filter matchId, pagination)
   */
  async getAllMessages(
    userId,
    { matchId = null, limit = 50, offset = 0 } = {}
  ) {
    let sql = `
        SELECT 
          m.*,
          p.first_name, p.dob, p.gender,
          CASE WHEN m.sender_id = $1 THEN 'sent' ELSE 'received' END as message_direction
        FROM messages m
        JOIN matches mt ON m.match_id = mt.id
        JOIN profiles p ON m.sender_id = p.user_id
        WHERE (mt.user1_id = $1 OR mt.user2_id = $1)
          AND m.deleted_at IS NULL
      `;
    const params = [userId];

    if (matchId) {
      sql += ` AND m.match_id = $2`;
      params.push(matchId);
    }

    sql += ` ORDER BY m.sent_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    return await DatabaseHelper.getAll(sql, params);
  }

  /**
   * Lấy 1 message theo id
   */
  async getMessageById(messageId) {
    const sql = `
        SELECT m.*, p.first_name, p.dob, p.gender
        FROM messages m
        JOIN profiles p ON m.sender_id = p.user_id
        WHERE m.id = $1 AND m.deleted_at IS NULL
      `;
    return await DatabaseHelper.getOne(sql, [messageId]);
  }

  /**
   * Cập nhật message (chỉ owner mới được update)
   */
  async updateMessage(messageId, userId, updateData) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
          UPDATE messages
          SET 
            content = COALESCE($3, content),
            message_type = COALESCE($4, message_type),
            edited_at = NOW()
          WHERE id = $1 AND sender_id = $2 AND deleted_at IS NULL
          RETURNING *
        `;
      const values = [
        messageId,
        userId,
        updateData.content,
        updateData.message_type,
      ];
      return await DatabaseHelper.getOne(sql, values, client);
    });
  }

  /**
   * Gửi tin nhắn mới với validation (bọc trong transaction)
   */
  async createMessage(messageData) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        INSERT INTO messages (
          match_id,
          sender_id,
          content,
          message_type,
          reply_to_message_id,
          sent_at
        )
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *
      `;

      const values = [
        messageData.match_id,
        messageData.sender_id,
        messageData.content,
        messageData.message_type || "text",
        messageData.reply_to_message_id || null,
      ];

      return await DatabaseHelper.getOne(sql, values, client);
    });
  }

  /**
   * Lấy user còn lại trong match (otherUserId)
   */
  async getOtherUserFromMatch(matchId, senderId) {
    const sql = `
    SELECT 
      CASE 
        WHEN user1_id = $2 THEN user2_id
        ELSE user1_id
      END as other_user_id
    FROM matches
    WHERE id = $1
      AND (user1_id = $2 OR user2_id = $2)
  `;
    const result = await DatabaseHelper.getOne(sql, [matchId, senderId]);
    return result ? result.other_user_id : null;
  }

  /**
   * Lấy tin nhắn của một match với pagination và optimization
   * (SELECT — không cần transaction)
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
        AND m.deleted_at IS NULL
      ORDER BY m.sent_at ASC
      LIMIT $3 OFFSET $4
    `;

    return await DatabaseHelper.getAll(sql, [matchId, userId, limit, offset]);
  }

  /**
   * Đánh dấu tin nhắn đã đọc (transaction)
   */
  async markAsRead(messageId, userId) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        UPDATE messages 
        SET read_at = NOW() 
        WHERE id = $1 AND sender_id != $2 AND read_at IS NULL
        RETURNING *
      `;
      return await DatabaseHelper.getOne(sql, [messageId, userId], client);
    });
  }

  /**
   * Đánh dấu tất cả tin nhắn trong match đã đọc (transaction)
   */
  async markAllAsRead(matchId, userId) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        UPDATE messages 
        SET read_at = NOW() 
        WHERE match_id = $1 AND sender_id != $2 AND read_at IS NULL
        RETURNING *
      `;
      return await DatabaseHelper.getAll(sql, [matchId, userId], client);
    });
  }

  /**
   * Đếm tin nhắn chưa đọc với optimization (SELECT)
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
   * Lấy tin nhắn cuối cùng của mỗi match với sender info (SELECT)
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
        AND m.deleted_at IS NULL
      ORDER BY m.match_id, m.sent_at DESC
    `;
    return await DatabaseHelper.getAll(sql, [userId]);
  }

  /**
   * Xóa tin nhắn (soft delete) - transaction
   */
  async deleteMessage(messageId, userId) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        UPDATE messages 
        SET deleted_at = NOW() 
        WHERE id = $1 AND sender_id = $2
        RETURNING *
      `;
      const row = await DatabaseHelper.getOne(sql, [messageId, userId], client);
      // Return boolean for compatibility with controllers that expect truthy/falsy
      return row ? row : null;
    });
  }

  /**
   * Tìm kiếm tin nhắn với full-text search (SELECT)
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
        AND m.deleted_at IS NULL
      ORDER BY m.sent_at DESC
    `;
    return await DatabaseHelper.getAll(sql, [matchId, `%${keyword}%`]);
  }

  /**
   * Lấy thống kê tin nhắn (SELECT)
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

    const recentActivity = await DatabaseHelper.getAll(recentActivitySql, [
      userId,
    ]);

    return {
      ...stats,
      recent_activity: recentActivity,
    };
  }

  /**
   * Lấy tin nhắn theo khoảng thời gian (SELECT)
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
        AND m.deleted_at IS NULL
      ORDER BY m.sent_at ASC
    `;
    return await DatabaseHelper.getAll(sql, [matchId, startDate, endDate]);
  }

  /**
   * Lấy tin nhắn media (SELECT)
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
        AND m.deleted_at IS NULL
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
   * Lấy tin nhắn đã pin (SELECT)
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
        AND m.deleted_at IS NULL
      ORDER BY m.pinned_at DESC
    `;
    return await DatabaseHelper.getAll(sql, [matchId]);
  }

  /**
   * Pin/Unpin tin nhắn (transaction)
   */
  async togglePinMessage(messageId, userId) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        UPDATE messages 
        SET is_pinned = NOT is_pinned,
            pinned_at = CASE WHEN is_pinned THEN NULL ELSE NOW() END
        WHERE id = $1 AND sender_id = $2
        RETURNING *
      `;
      return await DatabaseHelper.getOne(sql, [messageId, userId], client);
    });
  }

  /**
   * Lấy tin nhắn reactions (SELECT)
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
   * Thêm reaction cho tin nhắn (transaction)
   */
  async addReaction(messageId, userId, reactionType) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        INSERT INTO message_reactions (message_id, user_id, reaction_type, created_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (message_id, user_id) 
        DO UPDATE SET reaction_type = $3, created_at = NOW()
        RETURNING *
      `;
      return await DatabaseHelper.getOne(
        sql,
        [messageId, userId, reactionType],
        client
      );
    });
  }

  /**
   *
   */
  async removeReaction(messageId, reactionId) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        DELETE FROM message_reactions
        WHERE message_id = $1 AND id = $2
        RETURNING *
      `;
      return await DatabaseHelper.getOne(sql, [messageId, reactionId], client);
    });
  }

  /**
   * Thêm attachment (transaction)
   */
  async addAttachment(messageId, fileUrl, fileType, metadata) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        INSERT INTO message_attachments (message_id, file_url, file_type, metadata, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `;
      return await DatabaseHelper.getOne(
        sql,
        [messageId, fileUrl, fileType, metadata || {}],
        client
      );
    });
  }

  /**
   * Xóa attachment (transaction)
   */
  async removeAttachment(messageId, attachmentId) {
    return await DatabaseHelper.transaction(async (client) => {
      const sql = `
        DELETE FROM message_attachments
        WHERE message_id = $1 AND id = $2
        RETURNING *
      `;
      return await DatabaseHelper.getOne(
        sql,
        [messageId, attachmentId],
        client
      );
    });
  }

  /**
   * Lấy attachments của 1 message (SELECT)
   */
  async getAttachments(messageId) {
    const sql = `
      SELECT * FROM message_attachments
      WHERE message_id = $1
      ORDER BY created_at ASC
    `;
    return await DatabaseHelper.getAll(sql, [messageId]);
  }
}

module.exports = MessageModel;
