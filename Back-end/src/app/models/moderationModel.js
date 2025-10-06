const BaseModel = require("./BaseModel");
const DatabaseHelper = require("../../config/database/queryHelper");

class ModerationModel extends BaseModel {
  constructor() {
    super("moderation_reports", "id"); // Mặc định dùng bảng moderation_reports làm chính
  }

  // Methods cho moderation_reports

  /**
   * Lấy tất cả reports với thông tin liên quan (ví dụ: join với users)
   */
  async findAllReports() {
    const sql = `
      SELECT 
          mr.id, mr.reporter_id, mr.reported_user_id, mr.reported_content_id,
          mr.content_type, mr.reason, mr.description, mr.status, mr.priority,
          mr.admin_notes, mr.resolved_by, mr.resolved_at, mr.created_at, mr.updated_at,
          reporter.email AS reporter_email, reported.email AS reported_email
      FROM moderation_reports mr
      LEFT JOIN users reporter ON mr.reporter_id = reporter.id
      LEFT JOIN users reported ON mr.reported_user_id = reported.id
      ORDER BY mr.created_at DESC
    `;
    return await DatabaseHelper.getAll(sql);
  }

  /**
   * Lấy reports đang pending
   */
  async findPendingReports() {
    const sql = `
      SELECT 
          mr.id, mr.reporter_id, mr.reported_user_id, mr.reported_content_id,
          mr.content_type, mr.reason, mr.description, mr.status, mr.priority,
          mr.admin_notes, mr.resolved_by, mr.resolved_at, mr.created_at, mr.updated_at,
          reporter.email AS reporter_email, reported.email AS reported_email
      FROM moderation_reports mr
      LEFT JOIN users reporter ON mr.reporter_id = reporter.id
      LEFT JOIN users reported ON mr.reported_user_id = reported.id
      WHERE mr.status = 'pending'
      ORDER BY mr.priority DESC, mr.created_at ASC
    `;
    return await DatabaseHelper.getAll(sql);
  }

  /**
   * Lấy reports theo user_id (có thể là reporter hoặc reported)
   */
  async findReportsByUserId(userId) {
    const sql = `
      SELECT 
          mr.id, mr.reporter_id, mr.reported_user_id, mr.reported_content_id,
          mr.content_type, mr.reason, mr.description, mr.status, mr.priority,
          mr.admin_notes, mr.resolved_by, mr.resolved_at, mr.created_at, mr.updated_at,
          reporter.email AS reporter_email, reported.email AS reported_email
      FROM moderation_reports mr
      LEFT JOIN users reporter ON mr.reporter_id = reporter.id
      LEFT JOIN users reported ON mr.reported_user_id = reported.id
      WHERE mr.reporter_id = $1 OR mr.reported_user_id = $1
      ORDER BY mr.created_at DESC
    `;
    return await DatabaseHelper.getAll(sql, [userId]);
  }

  /**
   * Lấy report theo id
   */
  async findReportById(id) {
    const sql = `
      SELECT 
          mr.id, mr.reporter_id, mr.reported_user_id, mr.reported_content_id,
          mr.content_type, mr.reason, mr.description, mr.status, mr.priority,
          mr.admin_notes, mr.resolved_by, mr.resolved_at, mr.created_at, mr.updated_at,
          reporter.email AS reporter_email, reported.email AS reported_email
      FROM moderation_reports mr
      LEFT JOIN users reporter ON mr.reporter_id = reporter.id
      LEFT JOIN users reported ON mr.reported_user_id = reported.id
      WHERE mr.id = $1
    `;
    return await DatabaseHelper.getOne(sql, [id]);
  }

  /**
   * Tạo report mới
   */
  async createReport(reportData) {
    return await DatabaseHelper.transaction(async (client) => {
      const allowedFields = [
        "reporter_id", "reported_user_id", "reported_content_id", "content_type",
        "reason", "description", "status", "priority", "admin_notes", "resolved_by"
      ];
      const columns = Object.keys(reportData).filter((key) => allowedFields.includes(key));
      const values = columns.map((key) => reportData[key]);
      const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

      const sql = `
        INSERT INTO moderation_reports (${columns.join(", ")})
        VALUES (${placeholders})
        RETURNING *
      `;
      const result = await client.query(sql, values);
      return result.rows[0];
    });
  }

  /**
   * Cập nhật report
   */
  async updateReport(id, reportData) {
    return await DatabaseHelper.transaction(async (client) => {
      const allowedFields = [
        "status", "priority", "admin_notes", "resolved_by", "resolved_at"
      ];
      const columns = Object.keys(reportData).filter((key) => allowedFields.includes(key));
      const values = columns.map((key) => reportData[key]);
      const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(", ");

      const sql = `
        UPDATE moderation_reports
        SET ${setClause}, updated_at = NOW()
        WHERE id = $${values.length + 1}
        RETURNING *
      `;
      const result = await client.query(sql, [...values, id]);
      return result.rows[0];
    });
  }

  /**
   * Xóa report (soft delete bằng cách update status)
   */
  async deleteReport(id) {
    const sql = `
      UPDATE moderation_reports
      SET status = 'dismissed', updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    return await DatabaseHelper.getOne(sql, [id]);
  }

  // Methods cho moderation_actions

  /**
   * Lấy tất cả actions
   */
  async findAllActions() {
    const sql = `
      SELECT 
          ma.id, ma.report_id, ma.action, ma.action_details, ma.status,
          ma.assigned_to, ma.completed_at, ma.error_message, ma.created_at,
          ma.created_by, report.reason AS report_reason
      FROM moderation_actions ma
      LEFT JOIN moderation_reports report ON ma.report_id = report.id
      ORDER BY ma.created_at DESC
    `;
    return await DatabaseHelper.getAll(sql);
  }

  /**
   * Lấy actions theo report_id
   */
  async findActionsByReportId(reportId) {
    const sql = `
      SELECT 
          ma.id, ma.report_id, ma.action, ma.action_details, ma.status,
          ma.assigned_to, ma.completed_at, ma.error_message, ma.created_at,
          ma.created_by, report.reason AS report_reason
      FROM moderation_actions ma
      LEFT JOIN moderation_reports report ON ma.report_id = report.id
      WHERE ma.report_id = $1
      ORDER BY ma.created_at DESC
    `;
    return await DatabaseHelper.getAll(sql, [reportId]);
  }

  /**
   * Lấy action theo id
   */
  async findActionById(id) {
    const sql = `
      SELECT 
          ma.id, ma.report_id, ma.action, ma.action_details, ma.status,
          ma.assigned_to, ma.completed_at, ma.error_message, ma.created_at,
          ma.created_by, report.reason AS report_reason
      FROM moderation_actions ma
      LEFT JOIN moderation_reports report ON ma.report_id = report.id
      WHERE ma.id = $1
    `;
    return await DatabaseHelper.getOne(sql, [id]);
  }

  /**
   * Tạo action mới
   */
  async createAction(actionData) {
    return await DatabaseHelper.transaction(async (client) => {
      const allowedFields = [
        "report_id", "action", "action_details", "status", "assigned_to",
        "error_message", "created_by"
      ];
      const columns = Object.keys(actionData).filter((key) => allowedFields.includes(key));
      const values = columns.map((key) => actionData[key]);
      const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

      const sql = `
        INSERT INTO moderation_actions (${columns.join(", ")})
        VALUES (${placeholders})
        RETURNING *
      `;
      const result = await client.query(sql, values);
      return result.rows[0];
    });
  }

  /**
   * Thực thi action (executeAction) - ví dụ: update status và thực hiện logic cụ thể
   */
  async executeAction(actionData) {
    return await DatabaseHelper.transaction(async (client) => {
      // Tạo action trước
      const newAction = await this.createAction(actionData);

      // Thực hiện logic dựa trên action type (ví dụ đơn giản)
      if (newAction.action === 'ban_user') {
        // Giả sử ban user bằng cách update status user
        await client.query(`UPDATE users SET status = 'banned' WHERE id = $1`, [actionData.action_details.user_id]);
      } else if (newAction.action === 'delete_content') {
        // Giả sử xóa content (cần tùy chỉnh theo bảng content)
        // await client.query(`DELETE FROM some_content_table WHERE id = $1`, [actionData.action_details.content_id]);
      }

      // Update status action thành completed
      await client.query(`UPDATE moderation_actions SET status = 'completed', completed_at = NOW() WHERE id = $1`, [newAction.id]);

      // Update report status thành resolved nếu cần
      await client.query(`UPDATE moderation_reports SET status = 'resolved', resolved_at = NOW() WHERE id = $1`, [newAction.report_id]);

      return newAction;
    });
  }

  /**
   * Cập nhật action
   */
  async updateAction(id, actionData) {
    return await DatabaseHelper.transaction(async (client) => {
      const allowedFields = [
        "action", "action_details", "status", "assigned_to", "error_message"
      ];
      const columns = Object.keys(actionData).filter((key) => allowedFields.includes(key));
      const values = columns.map((key) => actionData[key]);
      const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(", ");

      const sql = `
        UPDATE moderation_actions
        SET ${setClause}, updated_at = NOW()
        WHERE id = $${values.length + 1}
        RETURNING *
      `;
      const result = await client.query(sql, [...values, id]);
      return result.rows[0];
    });
  }

  /**
   * Xóa action
   */
  async deleteAction(id) {
    const sql = `
      DELETE FROM moderation_actions
      WHERE id = $1
      RETURNING *
    `;
    return await DatabaseHelper.getOne(sql, [id]);
  }
}

module.exports = ModerationModel;