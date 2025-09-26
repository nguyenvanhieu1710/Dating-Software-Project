const BaseController = require("./BaseController");
const MatchModel = require("../models/matchModel");

class MatchController extends BaseController {
  constructor() {
    super(new MatchModel());
  }

  /**
   * Lấy tất cả matches của user
   */
  async getMatchesByUserId(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const matches = await this.model.getMatchesByUserId(userId);

      res.json({
        success: true,
        data: matches,
        message: "Matches retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get matches");
    }
  }

  /**
   * Lấy match theo ID
   */
  async getMatchById(req, res) {
    try {
      const { matchId, userId } = req.params;
      this.validateId(matchId);
      this.validateId(userId);

      const match = await this.model.getMatchById(matchId, userId);

      if (!match) {
        return res.status(404).json({
          success: false,
          message: "Match not found",
        });
      }

      res.json({
        success: true,
        data: match,
        message: "Match retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get match");
    }
  }

  /**
   * Unmatch
   */
  async unmatch(req, res) {
    try {
      const { matchId, userId } = req.params;
      this.validateId(matchId);
      this.validateId(userId);

      const match = await this.model.unmatch(matchId, userId);

      if (!match) {
        return res.status(404).json({
          success: false,
          message: "Match not found",
        });
      }

      res.json({
        success: true,
        data: match,
        message: "Match unmatched successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to unmatch");
    }
  }

  /**
   * Lấy thống kê matches
   */
  async getMatchStats(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const stats = await this.model.getMatchStats(userId);

      res.json({
        success: true,
        data: stats,
        message: "Match statistics retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get match statistics");
    }
  }

  /**
   * Kiểm tra mutual match
   */
  async checkMutualMatch(req, res) {
    try {
      const { user1Id, user2Id } = req.params;
      this.validateId(user1Id);
      this.validateId(user2Id);

      const mutualMatch = await this.model.checkMutualMatch(user1Id, user2Id);

      res.json({
        success: true,
        data: mutualMatch,
        message: "Mutual match check completed",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to check mutual match");
    }
  }

  /**
   * Lấy tất cả matches (admin/debug)
   */
  async getAllMatches(req, res) {
    try {
      const matches = await this.model.getAllMatches();

      res.json({
        success: true,
        data: matches,
        message: "All matches retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get all matches");
    }
  }
}

module.exports = MatchController; 