import { httpService } from './http.service';
import {
  IConsumable,
  ApiResponse,
  ConsumableQueryParams,
  CreateConsumableRequest,
  UpdateConsumableRequest,
  AddSuperLikesRequest,
  AddBoostsRequest,
} from '@/types/consumable';

class AdminConsumableService {
  private readonly basePath = '/consumable';

  // ===== BASIC CRUD OPERATIONS =====

  /**
   * Lấy tất cả consumables
   */
  async getAllConsumables(params?: ConsumableQueryParams): Promise<ApiResponse<IConsumable[]>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<IConsumable[]>>(`${this.basePath}${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Lấy consumables theo user ID
   */
  async getConsumablesByUserId(userId: number): Promise<ApiResponse<IConsumable>> {
    return httpService.get<ApiResponse<IConsumable>>(`${this.basePath}/by-user/${userId}`);
  }

  /**
   * Tạo consumable mới
   */
  async createConsumable(consumableData: CreateConsumableRequest): Promise<ApiResponse<IConsumable>> {
    return httpService.post<ApiResponse<IConsumable>>(this.basePath, consumableData);
  }

  /**
   * Cập nhật consumable
   */
  async updateConsumable(userId: number, consumableData: UpdateConsumableRequest): Promise<ApiResponse<IConsumable>> {
    return httpService.put<ApiResponse<IConsumable>>(`${this.basePath}/${userId}`, consumableData);
  }

  // ===== BATCH OPERATIONS =====

  /**
   * Bulk add super likes to multiple users
   */
  async bulkAddSuperLikes(userIds: number[], amount: number): Promise<ApiResponse<void>> {
    return httpService.post<ApiResponse<void>>(`${this.basePath}/bulk/super-likes`, {
      user_ids: userIds,
      amount,
    });
  }

  /**
   * Bulk add boosts to multiple users
   */
  async bulkAddBoosts(userIds: number[], amount: number): Promise<ApiResponse<void>> {
    return httpService.post<ApiResponse<void>>(`${this.basePath}/bulk/boosts`, {
      user_ids: userIds,
      amount,
    });
  }

  /**
   * Bulk reset daily super likes
   */
  async bulkResetDailySuperLikes(userIds: number[]): Promise<ApiResponse<void>> {
    return httpService.post<ApiResponse<void>>(`${this.basePath}/bulk/reset-super-likes`, {
      user_ids: userIds,
    });
  }

  // ===== UTILITY METHODS =====

  /**
   * Build query string từ params object
   */
  private buildQueryString(params?: Record<string, any>): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }

  /**
   * Validate consumable data before create/update
   */
  public validateConsumableData(consumableData: CreateConsumableRequest | UpdateConsumableRequest): string[] {
    const errors: string[] = [];

    if ('user_id' in consumableData) {
      if (!consumableData.user_id || consumableData.user_id <= 0) {
        errors.push('User ID không hợp lệ');
      }
    }

    if (consumableData.super_likes_balance !== undefined && consumableData.super_likes_balance < 0) {
      errors.push('Số lượng super likes không thể âm');
    }

    if (consumableData.boosts_balance !== undefined && consumableData.boosts_balance < 0) {
      errors.push('Số lượng boosts không thể âm');
    }

    if (consumableData.last_super_like_reset) {
      const resetDate = new Date(consumableData.last_super_like_reset);
      if (isNaN(resetDate.getTime())) {
        errors.push('Ngày reset super like không hợp lệ');
      }
    }

    return errors;
  }

  /**
   * Format consumable data for display
   */
  public formatConsumableForDisplay(
    consumable: IConsumable
  ): IConsumable & {
    last_reset_formatted?: string;
    can_reset_today: boolean;
    total_consumables: number;
  } {
    const lastResetFormatted = consumable.last_super_like_reset
      ? this.formatRelativeTime(new Date(consumable.last_super_like_reset))
      : undefined;

    // Check if can reset today (if last reset was more than 24 hours ago or never)
    const canResetToday =
      !consumable.last_super_like_reset ||
      Date.now() - new Date(consumable.last_super_like_reset).getTime() > 24 * 60 * 60 * 1000;

    const totalConsumables = (consumable.super_likes_balance || 0) + (consumable.boosts_balance || 0);

    return {
      ...consumable,
      last_reset_formatted: lastResetFormatted,
      can_reset_today: canResetToday,
      total_consumables: totalConsumables,
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

    if (diffMinutes < 1) return 'Vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString('vi-VN');
  }

  /**
   * Validate amount for add operations
   */
  public validateAmount(amount: number): string[] {
    const errors: string[] = [];

    if (!amount || amount <= 0) {
      errors.push('Số lượng phải lớn hơn 0');
    }

    if (amount > 1000) {
      errors.push('Số lượng không thể vượt quá 1000 trong một lần');
    }

    if (!Number.isInteger(amount)) {
      errors.push('Số lượng phải là số nguyên');
    }

    return errors;
  }
}

// Export singleton instance
export const adminConsumableService = new AdminConsumableService();