import { httpService } from "./http.service";
import {
  ApiResponse,
  PaginatedResponse,
  SwipeQueryParams,
  CreateSwipeRequest,
  SwipeStats,
  SwipedUser,
  PotentialMatch,
  SwipeResult,
  ISwipe,
} from "@/types/swipe";

class AdminSwipeService {
  private readonly basePath = "/swipe";

  // ===== BASIC CRUD OPERATIONS =====

  /**
   * Lấy tất cả swipes với pagination và filter
   */
  async getAllSwipes(
    params?: SwipeQueryParams
  ): Promise<PaginatedResponse<ISwipe>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<PaginatedResponse<ISwipe>>(
      `${this.basePath}${queryString ? `?${queryString}` : ""}`
    );
  }

  /**
   * Thực hiện swipe
   */
  async performSwipe(
    swipeData: CreateSwipeRequest
  ): Promise<ApiResponse<SwipeResult>> {
    return httpService.post<ApiResponse<SwipeResult>>(this.basePath, swipeData);
  }

  /**
   * Undo swipe
   */
  async undoSwipe(
    swiperUserId: number,
    swipedUserId: number
  ): Promise<ApiResponse<null>> {
    return httpService.delete<ApiResponse<null>>(
      `${this.basePath}/${swiperUserId}/${swipedUserId}`
    );
  }

  // ===== SWIPE QUERIES =====

  /**
   * Lấy danh sách người đã swipe (người mà mình đã vuốt)
   */
  async getSwipedUsers(
    userId: number,
    action?: "like" | "pass" | "superlike"
  ): Promise<ApiResponse<SwipedUser[]>> {
    const queryString = action ? `?action=${action}` : "";
    return httpService.get<ApiResponse<SwipedUser[]>>(
      `${this.basePath}/users/${userId}/swipes/swiped${queryString}`
    );
  }

  /**
   * Lấy danh sách người đã swipe mình (người đã vuốt mình)
   */
  async getSwipedByUsers(
    userId: number,
    action?: "like" | "pass" | "superlike"
  ): Promise<ApiResponse<SwipedUser[]>> {
    const queryString = action ? `?action=${action}` : "";
    return httpService.get<ApiResponse<SwipedUser[]>>(
      `${this.basePath}/users/${userId}/swipes/swiped-by${queryString}`
    );
  }

  /**
   * Lấy thống kê swipe của user
   */
  async getSwipeStats(userId: number): Promise<ApiResponse<SwipeStats[]>> {
    return httpService.get<ApiResponse<SwipeStats[]>>(
      `${this.basePath}/users/${userId}/swipes/stats`
    );
  }

  /**
   * Lấy potential matches (người chưa swipe)
   */
  async getPotentialMatches(
    userId: number,
    limit: number = 20
  ): Promise<ApiResponse<PotentialMatch[]>> {
    return httpService.get<ApiResponse<PotentialMatch[]>>(
      `${this.basePath}/users/${userId}/swipes/potential-matches?limit=${limit}`
    );
  }

  // ===== UTILITY METHODS =====

  /**
   * Build query string từ params object
   */
  private buildQueryString(params?: Record<string, any>): string {
    if (!params) return "";

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }

  /**
   * Validate swipe data before create
   */
  public validateSwipeData(swipeData: CreateSwipeRequest): string[] {
    const errors: string[] = [];

    if (!swipeData.swiper_user_id || swipeData.swiper_user_id <= 0) {
      errors.push("Swiper User ID không hợp lệ");
    }

    if (!swipeData.swiped_user_id || swipeData.swiped_user_id <= 0) {
      errors.push("Swiped User ID không hợp lệ");
    }

    if (swipeData.swiper_user_id === swipeData.swiped_user_id) {
      errors.push("Không thể swipe chính mình");
    }

    const validActions = ["like", "dislike", "superlike"];
    if (!swipeData.action || !validActions.includes(swipeData.action)) {
      errors.push("Action phải là: like, dislike, hoặc superlike");
    }

    return errors;
  }

  /**
   * Format swipe data for display
   */
  public formatSwipeForDisplay(swipe: ISwipe): ISwipe & {
    created_at_formatted?: string;
    action_display: string;
  } {
    const createdAtFormatted = swipe.created_at
      ? this.formatRelativeTime(new Date(swipe.created_at))
      : undefined;

    return {
      ...swipe,
      created_at_formatted: createdAtFormatted,
      action_display: this.getActionDisplayName(swipe.action),
    };
  }

  /**
   * Format relative time (e.g., "2 giờ trước")
   */
  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  }

  /**
   * Get action display name
   */
  public getActionDisplayName(action: string): string {
    const actionMap: Record<string, string> = {
      like: "Like",
      pass: "Pass",
      superlike: "Super Like",
    };
    return actionMap[action] || action;
  }

  /**
   * Get action icon name (for UI)
   */
  public getActionIcon(action: string): string {
    const iconMap: Record<string, string> = {
      like: "heart",
      pass: "close",
      superlike: "star",
    };
    return iconMap[action] || "help";
  }

  /**
   * Get action color (for UI)
   */
  public getActionColor(action: string): string {
    const colorMap: Record<string, string> = {
      like: "#4CAF50",
      pass: "#F44336",
      superlike: "#2196F3",
    };
    return colorMap[action] || "#9E9E9E";
  }

  /**
   * Calculate swipe statistics summary
   */
  public calculateSwipeStatsSummary(stats: SwipeStats[]): {
    totalSwipes: number;
    likes: number;
    dislikes: number;
    superlikes: number;
    likeRate: number;
  } {
    const totalSwipes = stats.reduce((sum, stat) => sum + stat.count, 0);
    const likes = stats.find((s) => s.action === "like")?.count || 0;
    const dislikes = stats.find((s) => s.action === "dislike")?.count || 0;
    const superlikes = stats.find((s) => s.action === "superlike")?.count || 0;
    const likeRate =
      totalSwipes > 0 ? ((likes + superlikes) / totalSwipes) * 100 : 0;

    return {
      totalSwipes,
      likes,
      dislikes,
      superlikes,
      likeRate: Math.round(likeRate * 10) / 10, // Round to 1 decimal place
    };
  }

  /**
   * Check if user has swiped another user
   */
  public hasSwipedUser(
    swipes: ISwipe[],
    swiperUserId: number,
    swipedUserId: number
  ): boolean {
    return swipes.some(
      (swipe) =>
        swipe.swiper_user_id === swiperUserId &&
        swipe.swiped_user_id === swipedUserId
    );
  }

  /**
   * Get swipe between two users
   */
  public getSwipeBetweenUsers(
    swipes: ISwipe[],
    swiperUserId: number,
    swipedUserId: number
  ): ISwipe | undefined {
    return swipes.find(
      (swipe) =>
        swipe.swiper_user_id === swiperUserId &&
        swipe.swiped_user_id === swipedUserId
    );
  }

  /**
   * Filter swipes by action
   */
  public filterSwipesByAction(
    swipes: ISwipe[],
    action: "like" | "dislike" | "superlike"
  ): ISwipe[] {
    return swipes.filter((swipe) => swipe.action === action);
  }

  /**
   * Group swipes by date
   */
  public groupSwipesByDate(swipes: ISwipe[]): Record<string, ISwipe[]> {
    return swipes.reduce((groups, swipe) => {
      const date = new Date(swipe.created_at).toLocaleDateString("vi-VN");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(swipe);
      return groups;
    }, {} as Record<string, ISwipe[]>);
  }
}

// Export singleton instance
export const adminSwipeService = new AdminSwipeService();
