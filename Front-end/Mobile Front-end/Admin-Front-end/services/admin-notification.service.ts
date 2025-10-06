import { httpService } from "./http.service";
import {
  INotification,
  ApiResponse,
  PaginatedResponse,
  NotificationQueryParams,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  SearchNotificationsResponse,
} from "@/types/notification";

class AdminNotificationService {
  private readonly basePath = "/notifications";

  // ===== BASIC CRUD OPERATIONS =====

  /**
   * Get all notifications with pagination
   */
  async getAllNotifications(
    params?: NotificationQueryParams
  ): Promise<ApiResponse<PaginatedResponse<INotification>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<INotification>>>(
      `${this.basePath}${queryString ? `?${queryString}` : ""}`
    );
  }

  /**
   * Get notifications by user ID
   */
  async getNotificationsByUserId(
    userId: number,
    params?: NotificationQueryParams
  ): Promise<ApiResponse<PaginatedResponse<INotification>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<INotification>>>(
      `${this.basePath}/user/${userId}${queryString ? `?${queryString}` : ""}`
    );
  }

  /**
   * Get notification by ID
   */
  async getNotificationById(id: number): Promise<ApiResponse<INotification>> {
    return httpService.get<ApiResponse<INotification>>(
      `${this.basePath}/${id}`
    );
  }

  /**
   * Search notifications by keyword
   */
  async searchNotifications(
    keyword: string
  ): Promise<SearchNotificationsResponse> {
    return httpService.get<SearchNotificationsResponse>(
      `${this.basePath}/search?keyword=${encodeURIComponent(keyword)}`
    );
  }

  /**
   * Create a new notification
   */
  async createNotification(
    notificationData: CreateNotificationRequest
  ): Promise<ApiResponse<INotification>> {
    return httpService.post<ApiResponse<INotification>>(
      this.basePath,
      notificationData
    );
  }

  /**
   * Send push notification
   */
  async sendPushNotification(
    notificationData: CreateNotificationRequest
  ): Promise<ApiResponse<INotification>> {
    return httpService.post<ApiResponse<INotification>>(
      `${this.basePath}/push`,
      notificationData
    );
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: number): Promise<ApiResponse<void>> {
    return httpService.put<ApiResponse<void>>(`${this.basePath}/read-all`, {
      user_id: userId,
    });
  }

  /**
   * Delete a notification (soft delete)
   */
  async deleteNotification(id: number): Promise<ApiResponse<INotification>> {
    return httpService.delete<ApiResponse<INotification>>(
      `${this.basePath}/${id}`
    );
  }

  // ===== VALIDATION METHODS =====

  /**
   * Validate notification data before create
   */
  validateNotificationData(
    notificationData: CreateNotificationRequest
  ): string[] {
    const errors: string[] = [];

    if (
      !notificationData.user_id ||
      !Number.isInteger(notificationData.user_id) ||
      notificationData.user_id < 1
    ) {
      errors.push("Valid user_id is required");
    }

    if (!notificationData.title || !notificationData.title.trim()) {
      errors.push("Notification title is required");
    } else if (notificationData.title.length < 2) {
      errors.push("Notification title must be at least 2 characters");
    } else if (notificationData.title.length > 100) {
      errors.push("Notification title must not exceed 100 characters");
    }

    if (!notificationData.body || !notificationData.body.trim()) {
      errors.push("Notification body is required");
    } else if (notificationData.body.length < 2) {
      errors.push("Notification body must be at least 2 characters");
    } else if (notificationData.body.length > 500) {
      errors.push("Notification body must not exceed 500 characters");
    }

    if (notificationData.data && typeof notificationData.data !== "object") {
      errors.push("data must be a valid object");
    }

    return errors;
  }

  /**
   * Validate search keyword
   */
  validateSearchKeyword(keyword: string): string[] {
    const errors: string[] = [];

    if (!keyword || !keyword.trim()) {
      errors.push("Search keyword is required");
    } else if (keyword.length < 2) {
      errors.push("Search keyword must be at least 2 characters");
    }

    return errors;
  }

  /**
   * Validate pagination params
   */
  validatePaginationParams(params: NotificationQueryParams): string[] {
    const errors: string[] = [];

    if (params.page !== undefined && params.page < 1) {
      errors.push("Page must be greater than 0");
    }

    if (
      params.limit !== undefined &&
      (params.limit < 1 || params.limit > 100)
    ) {
      errors.push("Limit must be between 1 and 100");
    }

    if (
      params.user_id !== undefined &&
      (!Number.isInteger(params.user_id) || params.user_id < 1)
    ) {
      errors.push("Valid user_id is required");
    }

    if (params.type && typeof params.type !== "string") {
      errors.push("type must be a string");
    }

    return errors;
  }

  // ===== UTILITY METHODS =====

  /**
   * Build query string from params object
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
   * Format notification data for display
   */
  formatNotificationForDisplay(notification: INotification): INotification & {
    sent_at_formatted?: string;
    read_at_formatted?: string;
    created_at_formatted?: string;
  } {
    const sentAtFormatted = notification.sent_at
      ? this.formatDate(new Date(notification.sent_at))
      : undefined;

    const readAtFormatted = notification.read_at
      ? this.formatDate(new Date(notification.read_at))
      : undefined;

    const createdAtFormatted = notification.created_at
      ? this.formatDate(new Date(notification.created_at))
      : undefined;

    return {
      ...notification,
      sent_at_formatted: sentAtFormatted,
      read_at_formatted: readAtFormatted,
      created_at_formatted: createdAtFormatted,
    };
  }

  /**
   * Format date to readable string
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return this.formatDate(date);
  }

  /**
   * Sort notifications by sent_at
   */
  sortNotificationsBySentAt(
    notifications: INotification[],
    ascending: boolean = false
  ): INotification[] {
    return [...notifications].sort((a, b) => {
      const dateA = a.sent_at ? new Date(a.sent_at).getTime() : 0;
      const dateB = b.sent_at ? new Date(b.sent_at).getTime() : 0;
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Group notifications by type
   */
  groupNotificationsByType(
    notifications: INotification[]
  ): Record<string, INotification[]> {
    return notifications.reduce((acc, notification) => {
      const type = notification.data?.type || "Unknown";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(notification);
      return acc;
    }, {} as Record<string, INotification[]>);
  }

  /**
   * Filter notifications by read status
   */
  filterNotificationsByReadStatus(
    notifications: INotification[]
  ): INotification[] {
    return notifications.filter(
      (notification) => notification.read_at !== null
    );
  }

  /**
   * Filter notifications by type
   */
  filterNotificationsByType(
    notifications: INotification[],
    type: string
  ): INotification[] {
    return notifications.filter(
      (notification) => notification.data?.type === type
    );
  }

  /**
   * Get unique notification types
   */
  getUniqueTypes(notifications: INotification[]): string[] {
    const types = notifications.map(
      (notification) => notification.data?.type || "Unknown"
    );
    return Array.from(new Set(types)).sort();
  }

  /**
   * Search notifications locally (client-side filtering)
   */
  searchNotificationsLocally(
    notifications: INotification[],
    keyword: string
  ): INotification[] {
    const lowerKeyword = keyword.toLowerCase();
    return notifications.filter(
      (notification) =>
        notification.title.toLowerCase().includes(lowerKeyword) ||
        notification.body.toLowerCase().includes(lowerKeyword) ||
        (notification.data?.type &&
          notification.data.type.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * Get pagination info text
   */
  getPaginationInfo(page: number, limit: number, total: number): string {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return `Showing ${start}-${end} of ${total} notifications`;
  }
}

// Export singleton instance
export const adminNotificationService = new AdminNotificationService();
