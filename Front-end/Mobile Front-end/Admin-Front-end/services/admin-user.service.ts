import { httpService } from "./http.service";
import {
  IUser,
  ApiResponse,
  PaginatedResponse,
  UserQueryParams,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/user";
import { IProfile } from "@/types/profile"; // Assuming this exists
import {
  IUserVerification,
  VerificationQueryParams,
  UpdateVerificationRequest,
} from "@/types/user-verification";
import {
  IUserDevice,
  DeviceQueryParams,
  CreateDeviceRequest,
  UpdateDeviceRequest,
} from "@/types/user-device";
import {
  IUserBlock,
  BlockQueryParams,
  CreateBlockRequest,
} from "@/types/user-block";
import { FlatUserProfile } from "@/types/user";

// Combined User with Profile type
export type UserWithProfile = IUser & { profile?: IProfile };

class AdminUserService {
  private readonly basePath = "/user";

  // ===== USER OPERATIONS =====

  /**
   * Get all users with pagination
   */
  async getAllUsers(
    params?: UserQueryParams
  ): Promise<ApiResponse<PaginatedResponse<UserWithProfile>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<UserWithProfile>>>(
      `${this.basePath}${queryString ? `?${queryString}` : ""}`
    );
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<ApiResponse<UserWithProfile>> {
    return httpService.get<ApiResponse<UserWithProfile>>(
      `${this.basePath}/${id}`
    );
  }

  /**
   * Search users
   */
  async searchUsers(keyword: string): Promise<ApiResponse<UserWithProfile[]>> {
    return httpService.get<ApiResponse<UserWithProfile[]>>(
      `${this.basePath}/search?keyword=${encodeURIComponent(keyword)}`
    );
  }

  /**
   * Get recommended users for a user
   */
  async getRecommendedUsers(
    userId: number
  ): Promise<ApiResponse<UserWithProfile[]>> {
    return httpService.get<ApiResponse<UserWithProfile[]>>(
      `${this.basePath}/recommend?user_id=${userId}`
    );
  }

  /**
   * Get current user profile (for authenticated user)
   */
  async getCurrentUser(): Promise<ApiResponse<UserWithProfile>> {
    return httpService.get<ApiResponse<UserWithProfile>>(`${this.basePath}/me`);
  }

  /**
   * Create a new user
   */
  async createUser(
    userData: CreateUserRequest
  ): Promise<ApiResponse<UserWithProfile>> {
    return httpService.post<ApiResponse<UserWithProfile>>(
      this.basePath,
      userData
    );
  }

  /**
   * Update a user
   */
  async updateUser(
    id: number,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<FlatUserProfile>> {
    return httpService.put<ApiResponse<FlatUserProfile>>(
      `${this.basePath}/${id}`,
      userData
    );
  }

  /**
   * Delete a user
   */
  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return httpService.delete<ApiResponse<void>>(`${this.basePath}/${id}`);
  }

  // ===== USER VERIFICATION OPERATIONS =====

  /**
   * Get all verifications with pagination
   */
  async getAllVerifications(
    params?: VerificationQueryParams
  ): Promise<ApiResponse<PaginatedResponse<IUserVerification>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<IUserVerification>>>(
      `${this.basePath}/verifications${queryString ? `?${queryString}` : ""}`
    );
  }

  /**
   * Get verification by ID
   */
  async getVerificationById(
    id: number
  ): Promise<ApiResponse<IUserVerification>> {
    return httpService.get<ApiResponse<IUserVerification>>(
      `${this.basePath}/verifications/${id}`
    );
  }

  /**
   * Get verifications by user ID
   */
  async getVerificationsByUserId(
    userId: number
  ): Promise<ApiResponse<IUserVerification[]>> {
    return httpService.get<ApiResponse<IUserVerification[]>>(
      `${this.basePath}/verifications/user/${userId}`
    );
  }

  /**
   * Update a verification
   */
  async updateVerification(
    id: number,
    verificationData: UpdateVerificationRequest
  ): Promise<ApiResponse<IUserVerification>> {
    return httpService.put<ApiResponse<IUserVerification>>(
      `${this.basePath}/verifications/${id}`,
      verificationData
    );
  }

  // ===== USER BLOCK OPERATIONS =====

  /**
   * Get all blocks
   */
  async getAllBlocks(
    params?: BlockQueryParams
  ): Promise<ApiResponse<PaginatedResponse<IUserBlock>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<IUserBlock>>>(
      `${this.basePath}/blocks${queryString ? `?${queryString}` : ""}`
    );
  }

  /**
   * Get blocks by blocker ID
   */
  async getBlocksByBlockerId(
    blockerId: number,
    params?: BlockQueryParams
  ): Promise<ApiResponse<PaginatedResponse<IUserBlock>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<IUserBlock>>>(
      `${this.basePath}/blocks/blocker/${blockerId}${
        queryString ? `?${queryString}` : ""
      }`
    );
  }

  /**
   * Block a user
   */
  async blockUser(
    blockData: CreateBlockRequest
  ): Promise<ApiResponse<IUserBlock>> {
    return httpService.post<ApiResponse<IUserBlock>>(
      `${this.basePath}/blocks`,
      blockData
    );
  }

  /**
   * Unblock a user
   */
  async unblockUser(blockedId: number): Promise<ApiResponse<void>> {
    return httpService.delete<ApiResponse<void>>(
      `${this.basePath}/blocks/${blockedId}`
    );
  }

  // ===== USER DEVICE OPERATIONS =====

  /**
   * get all device
   */
  async getAllDevices(
    params?: DeviceQueryParams
  ): Promise<ApiResponse<PaginatedResponse<IUserDevice>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<IUserDevice>>>(
      `${this.basePath}/devices${queryString ? `?${queryString}` : ""}`
    );
  }

  /**
   * Register a new device
   */
  async registerDevice(
    deviceData: CreateDeviceRequest
  ): Promise<ApiResponse<IUserDevice>> {
    return httpService.post<ApiResponse<IUserDevice>>(
      `${this.basePath}/devices`,
      deviceData
    );
  }

  /**
   * Get devices by user ID
   */
  async getDevicesByUserId(
    userId: number,
    params?: DeviceQueryParams
  ): Promise<ApiResponse<PaginatedResponse<IUserDevice>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<IUserDevice>>>(
      `${this.basePath}/devices/user/${userId}${
        queryString ? `?${queryString}` : ""
      }`
    );
  }

  /**
   * Update a device
   */
  async updateDevice(
    id: number,
    deviceData: UpdateDeviceRequest
  ): Promise<ApiResponse<IUserDevice>> {
    return httpService.put<ApiResponse<IUserDevice>>(
      `${this.basePath}/devices/${id}`,
      deviceData
    );
  }

  // ===== VALIDATION METHODS =====

  /**
   * Validate user data before create/update
   */
  validateUserData(userData: CreateUserRequest | UpdateUserRequest): string[] {
    const errors: string[] = [];

    if (userData.email && !this.validateEmail(userData.email)) {
      errors.push("Invalid email format");
    }

    if (
      userData.phone_number &&
      !this.validatePhoneNumber(userData.phone_number)
    ) {
      errors.push("Invalid phone number format");
    }

    if (userData.profile) {
      if (
        userData.profile.first_name &&
        userData.profile.first_name.length < 2
      ) {
        errors.push("First name must be at least 2 characters");
      }

      if (userData.profile.bio && userData.profile.bio.length > 500) {
        errors.push("Bio must not exceed 500 characters");
      }

      if (
        userData.profile.height_cm &&
        (userData.profile.height_cm < 100 || userData.profile.height_cm > 250)
      ) {
        errors.push("Height must be between 100cm and 250cm");
      }
    }

    return errors;
  }

  /**
   * Validate verification data
   */
  validateVerificationData(
    verificationData: UpdateVerificationRequest
  ): string[] {
    const errors: string[] = [];

    if (
      verificationData.status &&
      !["pending", "approved", "rejected"].includes(verificationData.status)
    ) {
      errors.push("Invalid status for verification");
    }

    return errors;
  }

  /**
   * Validate device data
   */
  validateDeviceData(
    deviceData: CreateDeviceRequest | UpdateDeviceRequest
  ): string[] {
    const errors: string[] = [];

    if (
      "user_id" in deviceData &&
      (!deviceData.user_id || deviceData.user_id < 1)
    ) {
      errors.push("Valid user_id is required");
    }

    if ("platform" in deviceData && !deviceData.platform) {
      errors.push("Platform is required");
    }

    return errors;
  }

  /**
   * Validate block data
   */
  validateBlockData(blockData: CreateBlockRequest): string[] {
    const errors: string[] = [];

    if (!blockData.blocker_id || blockData.blocker_id < 1) {
      errors.push("Valid blocker_id is required");
    }

    if (!blockData.blocked_id || blockData.blocked_id < 1) {
      errors.push("Valid blocked_id is required");
    }

    if (blockData.blocker_id === blockData.blocked_id) {
      errors.push("Cannot block self");
    }

    return errors;
  }

  /**
   * Validate email format
   */
  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Validate phone number format
   */
  private validatePhoneNumber(phone: string): boolean {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(phone);
  }

  /**
   * Validate search keyword
   */
  validateSearchKeyword(keyword: string): string[] {
    const errors: string[] = [];

    if (!keyword || keyword.trim().length < 2) {
      errors.push("Search keyword must be at least 2 characters");
    }

    return errors;
  }

  /**
   * Validate pagination params
   */
  validatePaginationParams(
    params:
      | UserQueryParams
      | VerificationQueryParams
      | DeviceQueryParams
      | BlockQueryParams
  ): string[] {
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
   * Format user data for display
   */
  public formatUserForDisplay(user: UserWithProfile): UserWithProfile & {
    display_name: string;
    age?: number;
    status_label: string;
    last_active_formatted?: string;
  } {
    const age = user.profile?.dob
      ? Math.floor(
          (Date.now() - new Date(user.profile.dob).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000)
        )
      : undefined;

    const statusLabels: Record<string, string> = {
      active: "Active",
      inactive: "Inactive",
      banned: "Banned",
      suspended: "Suspended",
    };

    const lastActiveFormatted = user.profile?.last_active_at
      ? this.formatRelativeTime(new Date(user.profile.last_active_at))
      : undefined;

    return {
      ...user,
      display_name: user.profile?.first_name || user.email.split("@")[0],
      age,
      status_label: statusLabels[user.status] || user.status,
      last_active_formatted: lastActiveFormatted,
    };
  }

  /**
   * Format verification for display
   */
  public formatVerificationForDisplay(
    verification: IUserVerification
  ): IUserVerification & {
    status_display: string;
    type_display: string;
  } {
    const statusDisplay =
      verification.status.charAt(0).toUpperCase() +
      verification.status.slice(1);
    const typeDisplay =
      verification.verification_type.charAt(0).toUpperCase() +
      verification.verification_type.slice(1);

    return {
      ...verification,
      status_display: statusDisplay,
      type_display: typeDisplay,
    };
  }

  /**
   * Format device for display
   */
  public formatDeviceForDisplay(device: IUserDevice): IUserDevice & {
    last_active_formatted?: string;
  } {
    const lastActiveFormatted = device.last_active_at
      ? this.formatRelativeTime(new Date(device.last_active_at))
      : undefined;

    return {
      ...device,
      last_active_formatted: lastActiveFormatted,
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
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US");
  }
}

// Export singleton instance
export const adminUserService = new AdminUserService();
