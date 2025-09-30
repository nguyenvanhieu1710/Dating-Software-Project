const BaseController = require("./BaseController");
const PaymentModel = require("../models/paymentModel");

class PaymentsController extends BaseController {
  constructor() {
    super(new PaymentModel());
  }

  /**
   * Lấy tất cả payments
   */
  async getAll(req, res) {
    try {
      const payments = await this.model.findAll();

      res.json({
        success: true,
        data: payments,
        message: "Payments retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve payments");
    }
  }

  /**
   * Lấy payment theo ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const payment = await this.model.findById(id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      res.json({
        success: true,
        data: payment,
        message: "Payment retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve payment");
    }
  }

  /**
   * Lấy payments theo user_id
   */
  async getByUserId(req, res) {
    try {
      const { user_id } = req.params;
      this.validateId(user_id);

      const payments = await this.model.findByUserId(user_id);

      res.json({
        success: true,
        data: payments,
        message: "Payments by user retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve payments by user");
    }
  }

  /**
   * Tạo payment mới
   */
  async create(req, res) {
    try {
      this.validateRequiredFields(req, ["user_id", "amount", "currency", "payment_method", "transaction_id"]);

      const payment = await this.model.create(req.body);

      res.status(201).json({
        success: true,
        data: payment,
        message: "Payment created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create payment");
    }
  }

  /**
   * Xử lý payment (processPayment)
   */
  async processPayment(req, res) {
    try {
      this.validateRequiredFields(req, ["user_id", "amount", "currency", "payment_method", "transaction_id"]);

      const payment = await this.model.processPayment(req.body);

      res.json({
        success: true,
        data: payment,
        message: "Payment processed successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to process payment");
    }
  }

  /**
   * Xóa payment (soft delete)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const payment = await this.model.delete(id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      res.json({
        success: true,
        data: payment,
        message: "Payment deleted successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to delete payment");
    }
  }
}

module.exports = PaymentsController;