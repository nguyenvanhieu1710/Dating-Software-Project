const BaseController = require("./BaseController");
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

class UserController extends BaseController {
  constructor() {
    super(new UserModel());
  }

  /**
   * Đề xuất các người dùng khác cho người dùng hiện tại
   */
  async getRecommendUsers(req, res){
    try {
      // Lấy userId từ JWT token (được set bởi auth middleware)
      const userId = req.user?.userId;
      // console.log('User ID:', userId);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }
      const users = await this.model.getRecommendUsers(userId);

      res.json({
        success: true,
        data: users,
        message: "Recommended users retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get recommended users");
    }
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
   * Get by id with profile
   */
  async getByIdWithProfile(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const user = await this.model.findByIdWithProfile(id);

      res.json({
        success: true,
        data: user,
        message: "User with profile retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get user by id with profile");
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
   * Tạo user với profile
   */
  async createWithProfile(req, res) {
    try {
      this.validateRequiredFields(req, ["email", "password", "phone_number"]);

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
      // console.log("Password hash:", password_hash);
      // return;

      // Create user
      const userData = {
        email,
        phone_number,
        password_hash,
        status: "unverified",
      };
      // console.log("User data:", userData);
      // Default Data
      const profileData = {
        first_name: req.body.first_name || email.split('@')[0],
        dob: req.body.dob || "1990-01-01",
        gender: req.body.gender || "male",
        bio: req.body.bio || "Hello, I'm new to this app!",
        job_title: req.body.job_title || "Software Developer",
        company: req.body.company || "Tech Company",
        school: req.body.school || "University",
        education: req.body.education || "Bachelor's Degree",
        height_cm: req.body.height_cm || 175,
        relationship_goals: req.body.relationship_goals || "Looking for serious relationship",
        location: req.body.location,
        popularity_score: req.body.popularity_score || 0.0,
        last_active_at: req.body.last_active_at || new Date(),
        is_verified: req.body.is_verified || false,
        is_online: req.body.is_online || true,
        last_seen: req.body.last_seen || null,
      };
      if (req.body.location && !req.body.location.startsWith("POINT")) {
        const [lat, lon] = req.body.location.split(",").map(n => n.trim());
        profileData.location = `POINT(${lon} ${lat})`;
      }
      // console.log("Profile data:", profileData);
      // return;

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
   * Cập nhật user với profile
   */
  async updateWithProfile(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      this.validateRequiredFields(req, ["email", "password", "phone_number"]);

      const { email, password, phone_number } = req.body;

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);
      // console.log("Password hash:", password_hash);
      // return;

      // Create user
      const userData = {
        email,
        phone_number,
        password_hash,
        status: "unverified",
      };
      // console.log("User data:", userData);
      // Default Data
      const profileData = {
        first_name: req.body.first_name || email.split('@')[0],
        dob: req.body.dob || "1990-01-01",
        gender: req.body.gender || "male",
        bio: req.body.bio || "Hello, I'm new to this app!",
        job_title: req.body.job_title || "Software Developer",
        company: req.body.company || "Tech Company",
        school: req.body.school || "University",
        education: req.body.education || "Bachelor's Degree",
        height_cm: req.body.height_cm || 175,
        relationship_goals: req.body.relationship_goals || "Looking for serious relationship",
        location: req.body.location || "POINT(106.660172 10.762622)",
        popularity_score: req.body.popularity_score || 0.0,
        last_active_at: req.body.last_active_at || new Date(),
        is_verified: req.body.is_verified || false,
        is_online: req.body.is_online || true,
        last_seen: req.body.last_seen || null,
      };
      // console.log("Profile data:", profileData);
      // return;

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
   * Xóa user với profile (soft delete)
   */
  async deleteWithProfile(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const user = await this.model.deleteWithProfile(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: user,
        message: "User deleted with profile successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to delete user with profile");
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
   * Get verifications
   */
  async getVerifications(req, res) {
    try {
      const verifications = await this.model.getVerifications();

      res.json({
        success: true,
        data: verifications,
        message: "Verifications retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve verifications");
    }
  }

  /**
   * Get verifications by id
   */
  async getVerificationsById(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const verification = await this.model.getVerificationsById(id);

      if (!verification) {
        return res.status(404).json({
          success: false,
          message: "Verification not found",
        });
      }

      res.json({
        success: true,
        data: verification,
        message: "Verification retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get verification");
    }
  }

  /**
   * Get verifications by user id
   */
  async getVerificationsByUserId(req, res) {
    try {
      const { user_id } = req.params;
      this.validateId(user_id);

      const verifications = await this.model.getVerificationsByUserId(user_id);

      if (!verifications) {
        return res.status(404).json({
          success: false,
          message: "Verifications not found",
        });
      }

      res.json({
        success: true,
        data: verifications,
        message: "Verifications retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve verifications");
    }
  }

  /**
   * Update verification
   */
  async updateVerification(req, res) {
    try {
      const { id } = req.params;
      this.validateId(id);

      const verification = await this.model.updateVerification(id, req.body);

      if (!verification) {
        return res.status(404).json({
          success: false,
          message: "Verification not found",
        });
      }

      res.json({
        success: true,
        data: verification,
        message: "Verification updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update verification");
    }
  }

  /**
   * get all block
   */
  async getBlocks(req, res) {
    try {
      const blocks = await this.model.getBlocks();

      if (!blocks) {
        return res.status(404).json({
          success: false,
          message: "Blocks not found",
        });
      }

      res.json({
        success: true,
        data: blocks,
        message: "Blocks retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve blocks");
    }
  }

  /**
   * Block a user
   */
  async blockUser(req, res) {
    try {
      const { blocker_id, blocked_id } = req.body;

      const user = await this.model.blockUser(blocker_id, blocked_id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: user,
        message: "User blocked successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to block user");
    }
  }

  /**
   * Unblock a user
   */
  async unblockUser(req, res) {
    try {
      const { blocker_id, blocked_id } = req.body;

      const user = await this.model.unblockUser(blocker_id, blocked_id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: user,
        message: "User unblocked successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to unblock user");
    }
  }

  /**
   * Get all device
   */
  async getDevices(req, res) {
    try {
      const devices = await this.model.getDevices();

      if (!devices) {
        return res.status(404).json({
          success: false,
          message: "Devices not found",
        });
      }

      res.json({
        success: true,
        data: devices,
        message: "Devices retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve devices");
    }
  }

  /**
   * registerDevice (tạo thiết bị khi người dùng login)
   */
  async registerDevice(req, res) {
    try {
      const device = await this.model.registerDevice(req.body);

      if (!device) {
        return res.status(404).json({
          success: false,
          message: "Device not found",
        });
      }

      res.json({
        success: true,
        data: device,
        message: "Device registered successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to register device");
    }
  }

  /**
   * getMyDevices (lấy danh sách thiết bị của mình)
   */
  async getMyDevices(req, res) {
    try {
      const { user_id } = req.body;

      const devices = await this.model.getMyDevices(user_id);

      if (!devices) {
        return res.status(404).json({
          success: false,
          message: "Devices not found",
        });
      }

      res.json({
        success: true,
        data: devices,
        message: "Devices retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get devices");
    }
  }

  /**
   * updateDevice (cập nhật thông tin thiết bị)
   */
  async updateDevice(req, res) {
    try {
      const { id } = req.params;
      console.log(id);
      console.log(req.body);

      const device = await this.model.updateDevice(id, req.body);

      if (!device) {
        return res.status(404).json({
          success: false,
          message: "Device not found",
        });
      }

      res.json({
        success: true,
        data: device,
        message: "Device updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update device");
    }
  }

  /**
   * getUsersByInterest (lấy danh sách user theo interest)
   */
  async getUsersByInterest(req, res) {
    try {
      const users = await this.model.getUsersByInterest(req.body);

      if (!users) {
        return res.status(404).json({
          success: false,
          message: "Users not found",
        });
      }

      res.json({
        success: true,
        data: users,
        message: "Users retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get users");
    }
  }

  /**
   * getUsersByGoal (lấy danh sách user theo goal)
   */
  async getUsersByGoal(req, res) {
    try {
      const users = await this.model.getUsersByGoal(req.body);

      if (!users) {
        return res.status(404).json({
          success: false,
          message: "Users not found",
        });
      }

      res.json({
        success: true,
        data: users,
        message: "Users retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get users");
    }
  }
}

module.exports = UserController;
