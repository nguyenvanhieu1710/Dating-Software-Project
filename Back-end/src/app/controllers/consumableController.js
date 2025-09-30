const BaseController = require("./BaseController");
const ConsumableModel = require("../models/consumableModel");

class ConsumableController extends BaseController {
  constructor() {
    super(new ConsumableModel());
  }

  /**
   * Lấy consumables của user
   */
  async getConsumablesByUserId(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const consumables = await this.model.findByUserId(userId);

      if (!consumables) {
        return res.status(404).json({
          success: false,
          message: "Consumables not found",
        });
      }

      res.json({
        success: true,
        data: consumables,
        message: "Consumables retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get consumables");
    }
  }

  /**
   * Get all
   */
  async getAllConsumables(req, res){
    try {
      const consumables = await this.model.getAllConsumables();

      res.json({
        success: true,
        data: consumables,
        message: "Consumables retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get consumables");
    }
  }

  /**
   * Create
   */
  async createConsumable(req, res){
    try{
      console.log(req.body);
      
      const consumable = await this.model.createConsumable(req.body);

      res.json({
        success: true,
        data: consumable,
        message: "Consumable created successfully",
      });
    }
    catch(error){
      this.handleError(res, error, "Failed to create consumable");
    }
  }

  /**
   * Update
   */
  async updateConsumable(req, res){
    try {
      const consumable = await this.model.updateConsumable(req.params.id, req.body);

      res.json({
        success: true,
        data: consumable,
        message: "Consumable updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update consumable");
    }
  }

  /**
   * Delete
   */
  async deleteConsumable(req, res){
    try {
      const consumable = await this.model.deleteConsumable(req.params.id);

      res.json({
        success: true,
        data: consumable,
        message: "Consumable deleted successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to delete consumable");
    }
  }
}

module.exports = ConsumableController; 