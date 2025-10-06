/**
 * Base Controller Class
 * Cung cấp các methods cơ bản cho tất cả controllers
 */
class BaseController {
  constructor(model) {
    this.model = model;
  }

  /**
   * Lấy tất cả records
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAll(req, res) {
    try {
      const options = this.buildQueryOptions(req.query);
      const data = await this.model.findAll(options);

      res.json({
        success: true,
        data,
        message: "Data retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve data");
    }
  }

  /**
   * Lấy record theo ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await this.model.findById(id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }

      res.json({
        success: true,
        data,
        message: "Record retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve record");
    }
  }

  /**
   * Tạo record mới
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async create(req, res) {
    try {
      const data = await this.model.create(req.body);

      res.status(201).json({
        success: true,
        data,
        message: "Record created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create record");
    }
  }

  /**
   * Cập nhật record
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await this.model.update(id, req.body);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }

      res.json({
        success: true,
        data,
        message: "Record updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update record");
    }
  }

  /**
   * Xóa record (soft delete)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const success = await this.model.delete(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }

      res.json({
        success: true,
        message: "Record deleted successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to delete record");
    }
  }

  /**
   * Xóa record vĩnh viễn
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const success = await this.model.destroy(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }

      res.json({
        success: true,
        message: "Record permanently deleted",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to delete record");
    }
  }

  /**
   * Tìm kiếm records
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async search(req, res) {
    try {
      const conditions = req.query;
      const data = await this.model.findWhere(conditions);

      res.json({
        success: true,
        data,
        message: "Search completed successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to search records");
    }
  }

  /**
   * Đếm số records
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async count(req, res) {
    try {
      const options = this.buildQueryOptions(req.query);
      const count = await this.model.count(options);

      res.json({
        success: true,
        data: { count },
        message: "Count retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to count records");
    }
  }

  /**
   * Xử lý lỗi chung
   * @param {Object} res - Express response object
   * @param {Error} error - Error object
   * @param {string} defaultMessage - Default error message
   */
  handleError(res, error, defaultMessage = "An error occurred") {
    console.error("Controller Error:", error);

    const statusCode = error.statusCode || 500;
    const message = error.message || defaultMessage;

    res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }

  /**
   * Xây dựng options cho query từ request query
   * @param {Object} query - Request query object
   * @returns {Object} Query options
   */
  buildQueryOptions(query) {
    const options = {};

    if (query.where) options.where = query.where;
    if (query.params) options.params = query.params.split(",");
    if (query.orderBy) options.orderBy = query.orderBy;
    if (query.limit) options.limit = parseInt(query.limit);
    if (query.offset) options.offset = parseInt(query.offset);

    return options;
  }

  /**
   * Validate request body
   * @param {Object} req - Express request object
   * @param {Array} requiredFields - Array of required field names
   * @returns {boolean} Validation result
   */
  validateRequiredFields(req, requiredFields) {
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      throw {
        statusCode: 400,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      };
    }

    return true;
  }

  /**
   * Validate ID parameter
   * @param {string} id - ID to validate
   * @returns {boolean} Validation result
   */
  validateId(id) {
    if (!id || isNaN(id)) {
      throw {
        statusCode: 400,
        message: "Invalid ID parameter",
      };
    }

    return true;
  }
}

module.exports = BaseController;
