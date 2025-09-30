const BaseController = require("./BaseController");
const ModerationModel = require("../models/moderationModel");

class ModerationController extends BaseController {
  constructor() {
    super(new ModerationModel());
  }

  // Methods cho moderation_reports

  /**
   * Lấy tất cả reports
   */
  async getAllReports(req, res) {
    try {
      const reports = await this.model.findAllReports();

      res.json({
        success: true,
        data: reports,
        message: "Reports retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve reports");
    }
  }

  /**
   * Lấy reports pending
   */
  async getPendingReports(req, res) {
    try {
      const reports = await this.model.findPendingReports();

      res.json({
        success: true,
        data: reports,
        message: "Pending reports retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve pending reports");
    }
  }

  /**
   * Lấy reports theo user_id
   */
  async getReportsByUserId(req, res) {
    try {
      const { user_id } = req.params;
      this.validateId(user_id);

      const reports = await this.model.findReportsByUserId(user_id);

      res.json({
        success: true,
        data: reports,
        message: "Reports by user retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve reports by user");
    }
  }

  /**
   * Lấy report theo id
   */
  async getReportById(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const report = await this.model.findReportById(id);

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        });
      }

      res.json({
        success: true,
        data: report,
        message: "Report retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve report");
    }
  }

  /**
   * Tạo report mới
   */
  async createReport(req, res) {
    try {
      this.validateRequiredFields(req, ["reporter_id", "reported_user_id", "content_type", "reason"]);

      const report = await this.model.createReport(req.body);

      res.status(201).json({
        success: true,
        data: report,
        message: "Report created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create report");
    }
  }

  /**
   * Cập nhật report
   */
  async updateReport(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const report = await this.model.updateReport(id, req.body);

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        });
      }

      res.json({
        success: true,
        data: report,
        message: "Report updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update report");
    }
  }

  /**
   * Xóa report
   */
  async deleteReport(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const report = await this.model.deleteReport(id);

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        });
      }

      res.json({
        success: true,
        data: report,
        message: "Report deleted successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to delete report");
    }
  }

  // Methods cho moderation_actions

  /**
   * Lấy tất cả actions
   */
  async getAllActions(req, res) {
    try {
      const actions = await this.model.findAllActions();

      res.json({
        success: true,
        data: actions,
        message: "Actions retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve actions");
    }
  }

  /**
   * Lấy actions theo report_id
   */
  async getActionsByReportId(req, res) {
    try {
      const { report_id } = req.params;
      this.validateId(report_id);

      const actions = await this.model.findActionsByReportId(report_id);

      res.json({
        success: true,
        data: actions,
        message: "Actions by report retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve actions by report");
    }
  }

  /**
   * Lấy action theo id
   */
  async getActionById(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const action = await this.model.findActionById(id);

      if (!action) {
        return res.status(404).json({
          success: false,
          message: "Action not found",
        });
      }

      res.json({
        success: true,
        data: action,
        message: "Action retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve action");
    }
  }

  /**
   * Tạo action mới
   */
  async createAction(req, res) {
    try {
      this.validateRequiredFields(req, ["report_id", "action", "created_by"]);

      const action = await this.model.createAction(req.body);

      res.status(201).json({
        success: true,
        data: action,
        message: "Action created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create action");
    }
  }

  /**
   * Thực thi action
   */
  async executeAction(req, res) {
    try {
      this.validateRequiredFields(req, ["report_id", "action", "created_by"]);

      const action = await this.model.executeAction(req.body);

      res.json({
        success: true,
        data: action,
        message: "Action executed successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to execute action");
    }
  }

  /**
   * Cập nhật action
   */
  async updateAction(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const action = await this.model.updateAction(id, req.body);

      if (!action) {
        return res.status(404).json({
          success: false,
          message: "Action not found",
        });
      }

      res.json({
        success: true,
        data: action,
        message: "Action updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update action");
    }
  }

  /**
   * Xóa action
   */
  async deleteAction(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const action = await this.model.deleteAction(id);

      if (!action) {
        return res.status(404).json({
          success: false,
          message: "Action not found",
        });
      }

      res.json({
        success: true,
        data: action,
        message: "Action deleted successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to delete action");
    }
  }
}

module.exports = ModerationController;