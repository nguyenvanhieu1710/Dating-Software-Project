const BaseController = require("./BaseController");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserController extends BaseController {
  constructor() {
    super(new UserModel());
  }

  /**
   * Lấy tất cả users với profile
   */
  async getAllWithProfiles(req, res) {
    try {
      const users = await this.model.findAllWithProfile();

      res.json({
        success: true,
        data: users,
        message: "Users with profiles retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve users with profiles");
    }
  }

  /**
   * Lấy thông tin user hiện tại (từ token)
   */
  async getCurrentUser(req, res) {
    try {
      // Lấy userId từ JWT token (được set bởi auth middleware)
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const user = await this.model.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Không trả về password_hash
      const { password_hash, ...userData } = user;

      res.json({
        success: true,
        data: userData,
        message: "Current user retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get current user");
    }
  }

  /**
   * Tìm user theo email
   */
  async findByEmail(req, res) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email parameter is required",
        });
      }

      const user = await this.model.findByEmail(email);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: user,
        message: "User found successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to find user by email");
    }
  }

  /**
   * Tạo user với profile
   */
  async createWithProfile(req, res) {
    try {
      this.validateRequiredFields(req, [
        "email",
        "username",
        "password",
        "first_name",
        "last_name",
      ]);

      // Hash password và chỉ insert password_hash
      const { password, ...rest } = req.body;
      const password_hash = await bcrypt.hash(password, 10);
      const userData = {
        ...rest,
        password_hash,
        role: req.body.role || "user",
        status: req.body.status || "pending",
      };

      const profileData = {
        bio: req.body.bio,
        phone: req.body.phone,
        date_of_birth: req.body.date_of_birth,
        gender: req.body.gender,
        city: req.body.city,
        country: req.body.country,
      };

      const user = await this.model.createWithProfile(userData, profileData);

      res.status(201).json({
        success: true,
        data: user,
        message: "User created with profile successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create user with profile");
    }
  }

  /**
   * Tạo user cơ bản (không profile)
   */
  async create(req, res) {
    try {
      this.validateRequiredFields(req, [
        "email",
        "username",
        "password",
        "first_name",
        "last_name",
      ]);

      // Hash password và chỉ insert password_hash
      const { password, ...rest } = req.body;
      const password_hash = await bcrypt.hash(password, 10);
      const userData = {
        ...rest,
        password_hash,
        role: req.body.role || "user",
        status: req.body.status || "pending",
      };

      const user = await this.model.create(userData);

      res.status(201).json({
        success: true,
        data: user,
        message: "User created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create user");
    }
  }

  /**
   * Cập nhật user với profile
   */
  async updateWithProfile(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        role: req.body.role,
        status: req.body.status,
      };

      const profileData = {
        bio: req.body.bio,
        phone: req.body.phone,
        date_of_birth: req.body.date_of_birth,
        gender: req.body.gender,
        city: req.body.city,
        country: req.body.country,
      };

      const user = await this.model.updateWithProfile(
        id,
        userData,
        profileData
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: user,
        message: "User updated with profile successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update user with profile");
    }
  }

  /**
   * Tìm kiếm users nâng cao
   */
  async searchUsers(req, res) {
    try {
      const criteria = {
        keyword: req.query.keyword,
        role: req.query.role,
        status: req.query.status,
        limit: parseInt(req.query.limit) || 10,
        offset: parseInt(req.query.offset) || 0,
      };

      const users = await this.model.searchUsers(criteria);

      res.json({
        success: true,
        data: users,
        message: "Users search completed successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to search users");
    }
  }

  /**
   * Lấy thống kê users
   */
  async getUserStatistics(req, res) {
    try {
      const stats = await this.model.countByRole();

      res.json({
        success: true,
        data: stats,
        message: "User statistics retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get user statistics");
    }
  }

  /**
   * Kích hoạt user
   */
  async activateUser(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const user = await this.model.update(id, {
        status: "active",
        email_verified: true,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: user,
        message: "User activated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to activate user");
    }
  }

  /**
   * Suspend user
   */
  async suspendUser(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const user = await this.model.update(id, { status: "suspended" });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: user,
        message: "User suspended successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to suspend user");
    }
  }

  /**
   * User login
   */
  async login(req, res) {
    try {
      this.validateRequiredFields(req, ["email", "password"]);

      const { email, password } = req.body;

      const user = await this.model.findByEmailForLogin(email);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          status: user.status 
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone_number: user.phone_number,
            status: user.status
          },
          token
        },
        message: "Login successful",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to login");
    }
  }

  /**
   * User registration
   */
  async register(req, res) {
    try {
      this.validateRequiredFields(req, [
        "email", "password", "phone_number"
      ]);

      const { email, password, phone_number } = req.body;

      // Check if user already exists
      const existingUser = await this.model.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Create user
      const userData = {
        email,
        phone_number,
        password_hash,
        status: "unverified"
      };

      const user = await this.model.create(userData);

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          status: user.status 
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone_number: user.phone_number,
            status: user.status
          },
          token
        },
        message: "Registration successful",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to register");
    }
  }

  /**
   * Verify user account
   */
  async verifyAccount(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const user = await this.model.update(userId, {
        status: "active"
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: user,
        message: "Account verified successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to verify account");
    }
  }

  /**
   * Reset password
   */
  async resetPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const user = await this.model.findByEmail(email);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Generate reset token (implement in model)
      const resetToken = await this.model.generatePasswordResetToken(user.id);

      res.json({
        success: true,
        message: "Password reset token generated successfully",
        data: { email },
      });
    } catch (error) {
      this.handleError(res, error, "Failed to reset password");
    }
  }

  /**
   * Change password
   */
  async changePassword(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      this.validateRequiredFields(req, ["currentPassword", "newPassword"]);

      const { currentPassword, newPassword } = req.body;

      const user = await this.model.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Update password
      const updatedUser = await this.model.update(userId, {
        password_hash: newPasswordHash
      });

      res.json({
        success: true,
        data: updatedUser,
        message: "Password changed successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to change password");
    }
  }
}

module.exports = UserController;
