const BaseController = require("./BaseController");
const GoalModel = require('../models/goalModel');

class GoalController extends BaseController {
  constructor() {
    super(new GoalModel());
  }
  /**
   * Get all goals with pagination
   */
  async getAllGoals(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const goals = await this.model.findAll({
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: goals,
        message: "Goals retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve goals");
    }
  }

  /**
   * Get goal by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const goal = await this.model.findById(id);

      if (!goal) {
        return res.status(404).json({
          success: false,
          message: "Goal not found",
        });
      }

      res.json({
        success: true,
        data: goal,
        message: "Goal retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve goal");
    }
  }

  /**
   * Search goals by keyword
   */
  async searchGoals(req, res) {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        return res.status(400).json({
          success: false,
          message: "Search keyword is required",
        });
      }

      const goals = await this.model.search(keyword);

      res.json({
        success: true,
        data: goals,
        message: "Goals searched successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to search goals");
    }
  }


  /**
   * Create a new goal
   */
  async createGoal(req, res) {
    try {
      this.validateRequiredFields(req, ["name"]);

      const { name, category } = req.body;
      const goal = await this.model.create({ name, category });

      res.status(201).json({
        success: true,
        data: goal,
        message: "Goal created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create goal");
    }
  }

  /**
   * Update an goal
   */
  async updateGoal(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);
      this.validateRequiredFields(req, ["name"]);

      const { name, category } = req.body;
      const updatedGoal = await this.model.update(id, { name, category });

      if (!updatedGoal) {
        return res.status(404).json({
          success: false,
          message: "Goal not found",
        });
      }

      res.json({
        success: true,
        data: updatedGoal,
        message: "Goal updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update goal");
    }
  }

  /**
   * Delete an goal (soft delete)
   */
  async deleteGoal(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const deletedGoal = await this.model.softDelete(id);

      if (!deletedGoal) {
        return res.status(404).json({
          success: false,
          message: "Goal not found",
        });
      }

      res.json({
        success: true,
        data: deletedGoal,
        message: "Goal deleted successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to delete goal");
    }
  }
}

module.exports = new GoalController();
