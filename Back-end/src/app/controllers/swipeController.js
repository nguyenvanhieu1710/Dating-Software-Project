const BaseController = require("./BaseController");
const SwipeModel = require("../models/swipeModel");
const MatchModel = require("../models/matchModel");
const ConsumableModel = require("../models/consumableModel");

class SwipeController extends BaseController {
  constructor() {
    super(new SwipeModel());
    this.matchModel = new MatchModel();
    this.consumableModel = new ConsumableModel();
  }

  /**
   * Thực hiện swipe
   */
  async performSwipe(req, res) {
    try {
      this.validateRequiredFields(req, [
        "swiper_user_id", "swiped_user_id", "action"
      ]);

      const { swiper_user_id, swiped_user_id, action } = req.body;
      // console.log("Swipe data:", req.body);

      // Kiểm tra xem đã swipe chưa
      const existingSwipe = await this.model.hasSwiped(swiper_user_id, swiped_user_id);
      if (existingSwipe) {
        return res.status(400).json({
          success: false,
          message: "Already swiped this user",
        });
      }

      // Kiểm tra super like
      if (action === 'superlike') {
        const canUseSuperLike = await this.consumableModel.canUseSuperLike(swiper_user_id);
        if (!canUseSuperLike) {
          return res.status(400).json({
            success: false,
            message: "No super likes available",
          });
        }
      }

      // Tạo swipe
      const swipe = await this.model.createSwipe({
        swiper_user_id,
        swiped_user_id,
        action
      });

      // Sử dụng super like nếu cần
      if (action === 'superlike') {
        await this.consumableModel.useSuperLike(swiper_user_id);
      }

      // Kiểm tra mutual match
      const mutualMatch = await this.matchModel.checkMutualMatch(swiper_user_id, swiped_user_id);
      
      let match = null;
      if (mutualMatch.isMutual) {
        match = await this.matchModel.createMatch(swiper_user_id, swiped_user_id);
      }

      res.json({
        success: true,
        data: {
          swipe,
          match,
          isMatch: !!match
        },
        message: match ? "It's a match!" : "Swipe recorded successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to perform swipe");
    }
  }

  /**
   * Lấy danh sách người đã swipe (Lấy danh sách người mà mình đã vuốt)
   */
  async getSwipedUsers(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const action = req.query.action;
      const swipedUsers = await this.model.getSwipedUsers(userId, action);

      res.json({
        success: true,
        data: swipedUsers,
        message: "Swiped users retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get swiped users");
    }
  }

  /**
   * Lấy danh sách người đã swipe mình (Lấy danh sách người mà mình đã vuốt)
   */
  async getSwipedByUsers(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const action = req.query.action;
      const swipedByUsers = await this.model.getSwipedByUsers(userId, action);

      res.json({
        success: true,
        data: swipedByUsers,
        message: "Users who swiped you retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get users who swiped you");
    }
  }

  /**
   * Lấy thống kê swipe
   */
  async getSwipeStats(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const stats = await this.model.getSwipeStats(userId);

      res.json({
        success: true,
        data: stats,
        message: "Swipe statistics retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get swipe statistics");
    }
  }

  /**
   * Undo swipe
   */
  async undoSwipe(req, res) {
    try {
      const { swiperUserId, swipedUserId } = req.params;
      this.validateId(swiperUserId);
      this.validateId(swipedUserId);

      const success = await this.model.deleteSwipe(swiperUserId, swipedUserId);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Swipe not found",
        });
      }

      res.json({
        success: true,
        message: "Swipe undone successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to undo swipe");
    }
  }

  /**
   * Lấy potential matches
   */
  async getPotentialMatches(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const limit = req.query.limit ? parseInt(req.query.limit) : 20;
      const potentialMatches = await this.model.getPotentialMatches(userId, limit);

      res.json({
        success: true,
        data: potentialMatches,
        message: "Potential matches retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get potential matches");
    }
  }

  /**
   * Lấy tất cả các swipes với phân trang và lọc
   */
  async getAllSwipes(req, res) {
    try {
      // Lấy tham số phân trang
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      // Tạo đối tượng filter từ query parameters
      const filters = {};
      if (req.query.swiper_user_id) filters.swiper_user_id = req.query.swiper_user_id;
      if (req.query.swiped_user_id) filters.swiped_user_id = req.query.swiped_user_id;
      if (req.query.action) filters.action = req.query.action;

      // Validate input
      if (page < 1) {
        return res.status(400).json({
          success: false,
          message: "Page must be greater than 0"
        });
      }

      if (limit < 1 || limit > 100) {
        return res.status(400).json({
          success: false,
          message: "Limit must be between 1 and 100"
        });
      }

      // Gọi model để lấy dữ liệu
      const result = await this.model.getAllSwipes(page, limit, filters);

      // Trả về kết quả
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: "Swipes retrieved successfully"
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve swipes");
    }
  }
}

module.exports = SwipeController; 