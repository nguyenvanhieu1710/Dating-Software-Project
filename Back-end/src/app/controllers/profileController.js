const BaseController = require("./BaseController");
const ProfileModel = require("../models/profileModel");
const PhotoModel = require("../models/photoModel");

class ProfileController extends BaseController {
  constructor() {
    super(new ProfileModel());
    this.photoModel = new PhotoModel();
  }

  /**
   * Lấy profile theo user_id
   */
  async getProfileByUserId(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const profile = await this.model.findByUserId(userId);
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found",
        });
      }

      // Lấy ảnh của user
      const photos = await this.photoModel.findByUserId(userId);
      profile.photos = photos;

      res.json({
        success: true,
        data: profile,
        message: "Profile retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve profile");
    }
  }

  // /**
  //  * Tạo profile mới
  //  */
  // async createProfile(req, res) {
  //   try {
  //     this.validateRequiredFields(req, [
  //       "user_id", "first_name", "dob", "gender"
  //     ]);

  //     const profile = await this.model.createProfile(req.body);

  //     res.status(201).json({
  //       success: true,
  //       data: profile,
  //       message: "Profile created successfully",
  //     });
  //   } catch (error) {
  //     this.handleError(res, error, "Failed to create profile");
  //   }
  // }

  /**
   * Cập nhật profile
   */
  async updateProfile(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const profile = await this.model.updateProfile(userId, req.body);

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found",
        });
      }

      res.json({
        success: true,
        data: profile,
        message: "Profile updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update profile");
    }
  }

  /**
   * Tìm kiếm profiles
   */
  async searchProfiles(req, res) {
    try {
      const criteria = {
        minAge: req.query.minAge ? parseInt(req.query.minAge) : null,
        maxAge: req.query.maxAge ? parseInt(req.query.maxAge) : null,
        gender: req.query.gender,
        preferredGender: req.query.preferredGender,
        maxDistance: req.query.maxDistance ? parseInt(req.query.maxDistance) : null,
        latitude: req.query.latitude ? parseFloat(req.query.latitude) : null,
        longitude: req.query.longitude ? parseFloat(req.query.longitude) : null,
        limit: req.query.limit ? parseInt(req.query.limit) : 20,
        offset: req.query.offset ? parseInt(req.query.offset) : 0
      };

      const profiles = await this.model.searchProfiles(criteria);

      res.json({
        success: true,
        data: profiles,
        message: "Profiles search completed successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to search profiles");
    }
  }

  /**
   * Cập nhật last active
   */
  async updateLastActive(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      await this.model.updateLastActive(userId);

      res.json({
        success: true,
        message: "Last active updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update last active");
    }
  }
}

module.exports = ProfileController; 