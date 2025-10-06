import { httpService } from "./http.service";
import {
  ISetting,
  ApiResponse,
  SettingQueryParams,
  CreateSettingRequest,
  UpdateSettingRequest,
  UpdateNotificationsRequest,
  UpdateLanguageRequest,
  UpdateThemeRequest,
} from "@/types/setting";

class UserSettingService {
  private readonly basePath = "/settings";

  // ===== BASIC CRUD OPERATIONS =====

  /**
   * Get all settings
   */
  async getAllSettings(
    params?: SettingQueryParams
  ): Promise<ApiResponse<ISetting[]>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<ISetting[]>>(
      `${this.basePath}${queryString ? `?${queryString}` : ""}`
    );
  }

  /**
   * Get setting by user ID
   */
  async getSettingsByUserId(userId: number): Promise<ApiResponse<ISetting>> {
    return httpService.get<ApiResponse<ISetting>>(`${this.basePath}/${userId}`);
  }

  /**
   * Create new setting
   */
  async createSetting(
    settingData: CreateSettingRequest
  ): Promise<ApiResponse<ISetting>> {
    return httpService.post<ApiResponse<ISetting>>(this.basePath, settingData);
  }

  /**
   * Update setting
   */
  async updateSetting(
    userId: number,
    settingData: UpdateSettingRequest
  ): Promise<ApiResponse<ISetting>> {
    return httpService.put<ApiResponse<ISetting>>(
      `${this.basePath}/${userId}`,
      settingData
    );
  }

  // ===== SPECIALIZED UPDATE OPERATIONS =====

  /**
   * Update notifications
   */
  async updateNotifications(
    userId: number,
    notificationData: UpdateNotificationsRequest
  ): Promise<ApiResponse<ISetting>> {
    return httpService.patch<ApiResponse<ISetting>>(
      `${this.basePath}/${userId}/notifications`,
      notificationData
    );
  }

  /**
   * Update language
   */
  async updateLanguage(
    userId: number,
    languageData: UpdateLanguageRequest
  ): Promise<ApiResponse<ISetting>> {
    return httpService.patch<ApiResponse<ISetting>>(
      `${this.basePath}/${userId}/language`,
      languageData
    );
  }

  /**
   * Update theme
   */
  async updateTheme(
    userId: number,
    themeData: UpdateThemeRequest
  ): Promise<ApiResponse<ISetting>> {
    return httpService.patch<ApiResponse<ISetting>>(
      `${this.basePath}/${userId}/theme`,
      themeData
    );
  }

  /**
   * Reset setting to default
   */
  async resetSettings(userId: number): Promise<ApiResponse<ISetting>> {
    return httpService.post<ApiResponse<ISetting>>(
      `${this.basePath}/${userId}/reset`,
      {}
    );
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
   * Validate setting data before create/update
   */
  public validateSettingData(
    settingData: CreateSettingRequest | UpdateSettingRequest
  ): string[] {
    const errors: string[] = [];

    if ("user_id" in settingData) {
      if (!settingData.user_id || settingData.user_id <= 0) {
        errors.push("Invalid User ID");
      }
    }

    if (settingData.min_age !== undefined) {
      if (settingData.min_age < 18 || settingData.min_age > 100) {
        errors.push("Minimum age must be between 18 and 100");
      }
    }

    if (settingData.max_age !== undefined) {
      if (settingData.max_age < 18 || settingData.max_age > 100) {
        errors.push("Maximum age must be between 18 and 100");
      }
    }

    if (
      settingData.min_age !== undefined &&
      settingData.max_age !== undefined
    ) {
      if (settingData.min_age > settingData.max_age) {
        errors.push("Minimum age cannot be greater than maximum age");
      }
    }

    if (settingData.max_distance_km !== undefined) {
      if (
        settingData.max_distance_km < 1 ||
        settingData.max_distance_km > 1000
      ) {
        errors.push("Maximum distance must be between 1 and 1000 km");
      }
    }

    if (
      settingData.preferred_gender !== undefined &&
      settingData.preferred_gender !== null
    ) {
      const validGenders = ["male", "female", "other"];
      if (!validGenders.includes(settingData.preferred_gender)) {
        errors.push("Invalid preferred gender");
      }
    }

    if (settingData.show_me !== undefined) {
      const validGenders = ["male", "female", "other"];
      const invalidGenders = settingData.show_me.filter(
        (g) => !validGenders.includes(g)
      );
      if (invalidGenders.length > 0) {
        errors.push("Show_me list contains invalid values");
      }
    }

    if (settingData.language !== undefined) {
      const validLanguages = ["en", "vi", "ja", "ko", "zh"];
      if (!validLanguages.includes(settingData.language)) {
        errors.push("Invalid language");
      }
    }

    if (settingData.theme !== undefined) {
      const validThemes = ["light", "dark", "system"];
      if (!validThemes.includes(settingData.theme)) {
        errors.push("Invalid theme");
      }
    }

    if (settingData.account_type !== undefined) {
      const validAccountTypes = ["free", "premium", "gold"];
      if (!validAccountTypes.includes(settingData.account_type)) {
        errors.push("Invalid account type");
      }
    }

    if (settingData.verification_status !== undefined) {
      const validStatuses = ["pending", "verified", "rejected"];
      if (!validStatuses.includes(settingData.verification_status)) {
        errors.push("Invalid verification status");
      }
    }

    return errors;
  }

  /**
   * Format setting data for display
   */
  public formatSettingForDisplay(setting: ISetting): ISetting & {
    created_at_formatted?: string;
    updated_at_formatted?: string;
    age_range: string;
    distance_display: string;
    notification_count: number;
  } {
    const createdAtFormatted = setting.created_at
      ? this.formatRelativeTime(new Date(setting.created_at))
      : undefined;

    const updatedAtFormatted = setting.updated_at
      ? this.formatRelativeTime(new Date(setting.updated_at))
      : undefined;

    const ageRange = `${setting.min_age} - ${setting.max_age} years old`;
    const distanceDisplay = `${setting.max_distance_km} km`;

    const notificationCount = [
      setting.new_matches_notification,
      setting.new_messages_notification,
      setting.message_likes_notification,
      setting.message_super_likes_notification,
      setting.profile_views_notification,
      setting.email_notifications,
      setting.push_notifications,
    ].filter(Boolean).length;

    return {
      ...setting,
      created_at_formatted: createdAtFormatted,
      updated_at_formatted: updatedAtFormatted,
      age_range: ageRange,
      distance_display: distanceDisplay,
      notification_count: notificationCount,
    };
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US");
  }

  /**
   * Get language display name
   */
  public getLanguageDisplayName(language: string): string {
    const languageMap: Record<string, string> = {
      en: "English",
      vi: "Vietnamese",
      ja: "日本語",
      ko: "한국어",
      zh: "中文",
    };
    return languageMap[language] || language;
  }

  /**
   * Get theme display name
   */
  public getThemeDisplayName(theme: string): string {
    const themeMap: Record<string, string> = {
      light: "Light",
      dark: "Dark",
      system: "System",
    };
    return themeMap[theme] || theme;
  }

  /**
   * Get account type display name
   */
  public getAccountTypeDisplayName(accountType: string): string {
    const accountTypeMap: Record<string, string> = {
      free: "Free",
      premium: "Premium",
      gold: "Gold",
    };
    return accountTypeMap[accountType] || accountType;
  }

  /**
   * Get verification status display name
   */
  public getVerificationStatusDisplayName(status: string): string {
    const statusMap: Record<string, string> = {
      pending: "Pending",
      verified: "Verified",
      rejected: "Rejected",
    };
    return statusMap[status] || status;
  }
}

// Export singleton instance
export const userSettingService = new UserSettingService();
