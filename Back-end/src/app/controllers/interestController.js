const BaseController = require("./BaseController");
const InterestModel = require('../models/interestModel');

class InterestController extends BaseController {
  constructor() {
    super(new InterestModel());
  }
  /**
   * Get all interests with pagination
   */
  async getAllInterests(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const interests = await this.model.findAll({
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: interests,
        message: "Interests retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve interests");
    }
  }

  /**
   * Get interest by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const interest = await this.model.findById(id);

      if (!interest) {
        return res.status(404).json({
          success: false,
          message: "Interest not found",
        });
      }

      res.json({
        success: true,
        data: interest,
        message: "Interest retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve interest");
    }
  }

  /**
   * Search interests by keyword
   */
  async searchInterests(req, res) {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        return res.status(400).json({
          success: false,
          message: "Search keyword is required",
        });
      }

      const interests = await this.model.search(keyword);

      res.json({
        success: true,
        data: interests,
        message: "Interests searched successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to search interests");
    }
  }


  /**
   * Create a new interest
   */
  async createInterest(req, res) {
    try {
      this.validateRequiredFields(req, ["name"]);

      const { name, category } = req.body;
      const interest = await this.model.create({ name, category });

      res.status(201).json({
        success: true,
        data: interest,
        message: "Interest created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create interest");
    }
  }

  /**
   * Update an interest
   */
  async updateInterest(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);
      this.validateRequiredFields(req, ["name"]);

      const { name, category } = req.body;
      const updatedInterest = await this.model.update(id, { name, category });

      if (!updatedInterest) {
        return res.status(404).json({
          success: false,
          message: "Interest not found",
        });
      }

      res.json({
        success: true,
        data: updatedInterest,
        message: "Interest updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update interest");
    }
  }

  /**
   * Delete an interest (soft delete)
   */
  async deleteInterest(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const deletedInterest = await this.model.softDelete(id);

      if (!deletedInterest) {
        return res.status(404).json({
          success: false,
          message: "Interest not found",
        });
      }

      res.json({
        success: true,
        data: deletedInterest,
        message: "Interest deleted successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to delete interest");
    }
  }
}

module.exports = new InterestController();
