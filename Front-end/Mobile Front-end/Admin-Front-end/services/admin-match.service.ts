// services/admin-match.service.ts
import { httpService } from "./http.service";
import {
  IMatch,
  MatchStats,
  MutualMatchResult,
  CreateMatchRequest,
  ApiResponse,
} from "@/types/matche";

class AdminMatchService {
  private readonly basePath = "/match";

  // ===== MATCH OPERATIONS =====

  /**
   * Lấy tất cả matches (admin/debug)
   */
  async getAllMatches(): Promise<ApiResponse<IMatch[]>> {
    return httpService.get<ApiResponse<IMatch[]>>(this.basePath);
  }

  /**
   * Lấy danh sách matches của 1 user
   */
  async getMatchesByUserId(userId: number): Promise<ApiResponse<IMatch[]>> {
    return httpService.get<ApiResponse<IMatch[]>>(
      `${this.basePath}/users/${userId}/matches`
    );
  }

  /**
   * Lấy chi tiết 1 match của user
   */
  async getMatchById(
    userId: number,
    matchId: number
  ): Promise<ApiResponse<IMatch>> {
    return httpService.get<ApiResponse<IMatch>>(
      `${this.basePath}/users/${userId}/matches/${matchId}`
    );
  }

  /**
   * Tạo match mới (admin có thể chủ động tạo)
   */
  async createMatch(
    data: CreateMatchRequest
  ): Promise<ApiResponse<IMatch>> {
    return httpService.post<ApiResponse<IMatch>>(this.basePath, data);
  }

  /**
   * Unmatch (xóa match giữa hai user)
   */
  async unmatch(
    userId: number,
    matchId: number
  ): Promise<ApiResponse<IMatch>> {
    return httpService.delete<ApiResponse<IMatch>>(
      `${this.basePath}/users/${userId}/matches/${matchId}`
    );
  }

  /**
   * Lấy thống kê match của 1 user
   */
  async getMatchStats(userId: number): Promise<ApiResponse<MatchStats>> {
    return httpService.get<ApiResponse<MatchStats>>(
      `${this.basePath}/users/${userId}/matches/stats`
    );
  }

  /**
   * Kiểm tra mutual match giữa 2 user
   */
  async checkMutualMatch(
    user1Id: number,
    user2Id: number
  ): Promise<ApiResponse<MutualMatchResult>> {
    return httpService.get<ApiResponse<MutualMatchResult>>(
      `${this.basePath}/users/${user1Id}/mutual/${user2Id}`
    );
  }
}

// Xuất singleton instance
export const adminMatchService = new AdminMatchService();
