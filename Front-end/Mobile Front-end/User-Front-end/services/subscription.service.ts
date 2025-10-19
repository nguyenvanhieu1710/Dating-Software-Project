import { httpService } from './http.service';
import { ISubscription } from '@/types/subscription';

// Response types for API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Query parameters for subscriptions
export interface SubscriptionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  user_id?: number;
  plan_type?: string;
  status?: string;
  billing_cycle?: string;
  sort_by?: 'id' | 'user_id' | 'plan_type' | 'status' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

// Create/Update request types
export interface CreateSubscriptionRequest {
  user_id: number;
  plan_type: string;
  status?: string;
  billing_cycle?: string;
  start_date?: string;
  end_date?: string;
  next_billing_date?: string;
  price?: number;
  currency?: string;
  payment_method?: string;
  auto_renew?: boolean;
  trial_period?: boolean;
  trial_end_date?: string;
  discount_applied?: number;
  promo_code?: string;
  platform?: string;
  transaction_id?: string;
  last_payment_date?: string;
  failed_payments?: number;
  refund_status?: string;
  refund_amount?: number;
}

export interface UpdateSubscriptionRequest {
  plan_type?: string;
  status?: string;
  billing_cycle?: string;
  start_date?: string;
  end_date?: string;
  next_billing_date?: string;
  price?: number;
  currency?: string;
  payment_method?: string;
  auto_renew?: boolean;
  trial_period?: boolean;
  trial_end_date?: string;
  discount_applied?: number;
  promo_code?: string;
  platform?: string;
  transaction_id?: string;
  last_payment_date?: string;
  failed_payments?: number;
  cancelled_at?: string;
  cancellation_reason?: string;
  refund_status?: string;
  refund_amount?: number;
}

// Statistics response type
export interface SubscriptionStats {
  total_subscriptions: number;
  active_subscriptions: number;
  total_revenue: number;
  plan_counts: Record<string, number>;
  status_counts: Record<string, number>;
}

class SubscriptionService {
  private readonly basePath = '/subscription';

  // ===== BASIC CRUD OPERATIONS =====

  /**
   * Lấy tất cả subscriptions
   */
  async getAllSubscriptions(params?: SubscriptionQueryParams): Promise<ApiResponse<ISubscription[]>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<ISubscription[]>>(
      `${this.basePath}${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Lấy subscription theo ID
   */
  async getSubscriptionById(subscriptionId: number): Promise<ApiResponse<ISubscription>> {
    return httpService.get<ApiResponse<ISubscription>>(`${this.basePath}/${subscriptionId}`);
  }

  /**
   * Lấy subscription hiện tại của user
   */
  async getCurrentSubscription(userId: number): Promise<ApiResponse<ISubscription>> {
    return httpService.get<ApiResponse<ISubscription>>(`${this.basePath}/users/${userId}/subscriptions/current`);
  }

  /**
   * Lấy tất cả subscriptions của user
   */
  async getSubscriptionsByUserId(userId: number): Promise<ApiResponse<ISubscription[]>> {
    return httpService.get<ApiResponse<ISubscription[]>>(`${this.basePath}/users/${userId}/subscriptions`);
  }

  /**
   * Tạo subscription mới
   */
  async createSubscription(subscriptionData: CreateSubscriptionRequest): Promise<ApiResponse<ISubscription>> {
    return httpService.post<ApiResponse<ISubscription>>(this.basePath, subscriptionData);
  }

  /**
   * Cập nhật subscription
   */
  async updateSubscription(subscriptionId: number, subscriptionData: UpdateSubscriptionRequest): Promise<ApiResponse<ISubscription>> {
    return httpService.put<ApiResponse<ISubscription>>(`${this.basePath}/${subscriptionId}`, subscriptionData);
  }

  /**
   * Hủy subscription
   */
  async cancelSubscription(subscriptionId: number, userId: number, reason?: string): Promise<ApiResponse<ISubscription>> {
    return httpService.delete<ApiResponse<ISubscription>>(`${this.basePath}/${subscriptionId}`, {
      data: { user_id: userId, cancellation_reason: reason }
    });
  }

  // ===== UTILITY METHODS =====

  /**
   * Kiểm tra xem user có subscription active không
   */
  async checkActiveSubscription(userId: number): Promise<ApiResponse<{ hasActiveSubscription: boolean }>> {
    return httpService.get<ApiResponse<{ hasActiveSubscription: boolean }>>(`${this.basePath}/users/${userId}/subscriptions/check`);
  }

  /**
   * Lấy thống kê subscriptions
   */
  async getSubscriptionStats(): Promise<ApiResponse<SubscriptionStats>> {
    return httpService.get<ApiResponse<SubscriptionStats>>(`${this.basePath}/stats`);
  }

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
   * Validate subscription data before create/update
   */
  public validateSubscriptionData(subscriptionData: CreateSubscriptionRequest | UpdateSubscriptionRequest): string[] {
    const errors: string[] = [];

    if ('user_id' in subscriptionData) {
      if (!subscriptionData.user_id || subscriptionData.user_id <= 0) {
        errors.push('User ID không hợp lệ');
      }
    }

    if ('plan_type' in subscriptionData && !subscriptionData.plan_type) {
      errors.push('Loại gói (plan_type) là bắt buộc');
    }

    if (subscriptionData.price !== undefined && subscriptionData.price < 0) {
      errors.push('Giá không thể âm');
    }

    if (subscriptionData.discount_applied !== undefined && subscriptionData.discount_applied < 0) {
      errors.push('Giảm giá không thể âm');
    }

    if (subscriptionData.failed_payments !== undefined && subscriptionData.failed_payments < 0) {
      errors.push('Số lần thanh toán thất bại không thể âm');
    }

    if (subscriptionData.refund_amount !== undefined && subscriptionData.refund_amount < 0) {
      errors.push('Số tiền hoàn lại không thể âm');
    }

    if (subscriptionData.start_date) {
      const startDate = new Date(subscriptionData.start_date);
      if (isNaN(startDate.getTime())) {
        errors.push('Ngày bắt đầu không hợp lệ');
      }
    }

    if (subscriptionData.end_date) {
      const endDate = new Date(subscriptionData.end_date);
      if (isNaN(endDate.getTime())) {
        errors.push('Ngày kết thúc không hợp lệ');
      }
    }

    if (subscriptionData.next_billing_date) {
      const nextBillingDate = new Date(subscriptionData.next_billing_date);
      if (isNaN(nextBillingDate.getTime())) {
        errors.push('Ngày thanh toán tiếp theo không hợp lệ');
      }
    }

    if (subscriptionData.trial_end_date) {
      const trialEndDate = new Date(subscriptionData.trial_end_date);
      if (isNaN(trialEndDate.getTime())) {
        errors.push('Ngày kết thúc thử nghiệm không hợp lệ');
      }
    }

    return errors;
  }

  /**
   * Format subscription data for display
   */
  public formatSubscriptionForDisplay(subscription: ISubscription): ISubscription & {
    start_date_formatted?: string;
    end_date_formatted?: string;
    next_billing_date_formatted?: string;
    trial_end_date_formatted?: string;
    is_active: boolean;
  } {
    const startDateFormatted = subscription.start_date
      ? this.formatRelativeTime(new Date(subscription.start_date))
      : undefined;

    const endDateFormatted = subscription.end_date
      ? this.formatRelativeTime(new Date(subscription.end_date))
      : undefined;

    const nextBillingDateFormatted = subscription.next_billing_date
      ? this.formatRelativeTime(new Date(subscription.next_billing_date))
      : undefined;

    const trialEndDateFormatted = subscription.trial_end_date
      ? this.formatRelativeTime(new Date(subscription.trial_end_date))
      : undefined;

    const isActive = subscription.status === 'active' && 
      (!subscription.end_date || new Date(subscription.end_date) > new Date());

    return {
      ...subscription,
      start_date_formatted: startDateFormatted,
      end_date_formatted: endDateFormatted,
      next_billing_date_formatted: nextBillingDateFormatted,
      trial_end_date_formatted: trialEndDateFormatted,
      is_active: isActive,
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
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();