const BaseController = require("./BaseController");
const AdminUserModel = require("../models/adminUserModel");
const bcrypt = require("bcryptjs");

class AdminUsersController extends BaseController {
  constructor() {
    super(new AdminUserModel());
  }

  /**
   * Lấy tất cả admin users
   */
  async getAll(req, res) {
    try {
      const admins = await this.model.findAll();

      res.json({
        success: true,
        data: admins,
        message: "Admin users retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve admin users");
    }
  }

  /**
   * Lấy admin user theo ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const admin = await this.model.findById(id);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin user not found",
        });
      }

      res.json({
        success: true,
        data: admin,
        message: "Admin user retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve admin user");
    }
  }

  /**
   * Lấy thông tin admin user hiện tại (từ token)
   */
  async getCurrentAdmin(req, res) {
    try {
      const adminId = req.user?.userId;

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: "Admin not authenticated",
        });
      }

      const admin = await this.model.findCurrentAdmin(adminId);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin user not found",
        });
      }

      res.json({
        success: true,
        data: admin,
        message: "Current admin user retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve current admin user");
    }
  }

  /**
   * Lấy danh sách admin users đang active
   */
  async getActiveAdmins(req, res) {
    try {
      const admins = await this.model.findActiveAdmins();

      res.json({
        success: true,
        data: admins,
        message: "Active admin users retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve active admin users");
    }
  }

  /**
   * Tạo admin user mới
   */
  async create(req, res) {
    try {
      this.validateRequiredFields(req, ["email", "password", "full_name", "role"]);

      const { email, password, full_name, role, is_active = true } = req.body;

      // Kiểm tra email đã tồn tại
      const existingAdmin = await this.model.findByEmail(email);
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "Admin user with this email already exists",
        });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Dữ liệu admin
      const adminData = {
        email,
        password_hash,
        full_name,
        role,
        is_active,
        created_by: req.user?.userId // Lấy từ token của admin tạo
      };

      const admin = await this.model.create(adminData);

      res.status(201).json({
        success: true,
        data: admin,
        message: "Admin user created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create admin user");
    }
  }

  /**
   * Cập nhật admin user
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const { email, password, full_name, role, is_active } = req.body;

      // Kiểm tra email đã tồn tại (nếu thay đổi email)
      if (email) {
        const existingAdmin = await this.model.findByEmail(email);
        if (existingAdmin && existingAdmin.id !== parseInt(id)) {
          return res.status(400).json({
            success: false,
            message: "Admin user with this email already exists",
          });
        }
      }

      // Chuẩn bị dữ liệu cập nhật
      const adminData = {};
      if (email) adminData.email = email;
      if (password) adminData.password_hash = await bcrypt.hash(password, 10);
      if (full_name) adminData.full_name = full_name;
      if (role) adminData.role = role;
      if (typeof is_active === 'boolean') adminData.is_active = is_active;

      const admin = await this.model.update(id, adminData);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin user not found",
        });
      }

      res.json({
        success: true,
        data: admin,
        message: "Admin user updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update admin user");
    }
  }

  /**
   * Xóa admin user (soft delete)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const admin = await this.model.delete(id);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin user not found",
        });
      }

      res.json({
        success: true,
        data: admin,
        message: "Admin user deleted successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to delete admin user");
    }
  }
}

module.exports = AdminUsersController;