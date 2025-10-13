import { httpService } from './http.service';
import {
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse,
  ApiResponse,
  IAuthResponse,
} from '@/types/auth';
import { IUser } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  private readonly basePath = '/auth';

  // ===== AUTHENTICATION OPERATIONS =====

  /**
   * Đăng nhập người dùng
   */
  async login(credentials: ILoginRequest): Promise<ILoginResponse> {
    return httpService.post<ILoginResponse>(`${this.basePath}/login`, credentials);
  }

  /**
   * Đăng ký người dùng mới
   */
  async register(userData: IRegisterRequest): Promise<IRegisterResponse> {
    return httpService.post<IRegisterResponse>(`${this.basePath}/register`, userData);
  }

  /**
   * Đăng xuất người dùng (clear token từ client)
   */
  async logout(): Promise<void> {
    await this.clearToken();
  }

  // ===== TOKEN MANAGEMENT =====

  /**
   * Lưu token vào localStorage
   */
  async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem('auth_token', token);
  }

  /**
   * Lấy token từ localStorage
   */
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  }

  /**
   * Xóa token khỏi localStorage
   */
  async clearToken(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
  }

  /**
   * Kiểm tra xem có token hay không
   */
  async hasToken(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Lưu thông tin user vào localStorage
   */
  async saveUser(user: IUser): Promise<void> {
    await AsyncStorage.setItem('user_data', JSON.stringify(user));
  }

  /**
   * Lấy thông tin user từ localStorage
   */
  async getUser(): Promise<IUser | null> {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Kiểm tra xem user đã đăng nhập hay chưa
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    const user = await this.getUser();
    return !!token && !!user;
  }

  // ===== VALIDATION METHODS =====

  /**
   * Validate dữ liệu đăng nhập
   */
  validateLoginData(data: ILoginRequest): string[] {
    const errors: string[] = [];

    if (!data.email || !data.email.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (!data.password || !data.password.trim()) {
      errors.push('Password is required');
    } else if (data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    return errors;
  }

  /**
   * Validate dữ liệu đăng ký
   */
  validateRegisterData(data: IRegisterRequest): string[] {
    const errors: string[] = [];

    if (!data.email || !data.email.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (!data.password || !data.password.trim()) {
      errors.push('Password is required');
    } else if (data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    } else if (data.password.length > 100) {
      errors.push('Password must not exceed 100 characters');
    }

    if (!data.phone_number || !data.phone_number.trim()) {
      errors.push('Phone number is required');
    } else if (!this.isValidPhoneNumber(data.phone_number)) {
      errors.push('Invalid phone number format');
    }

    return errors;
  }

  // ===== UTILITY METHODS =====

  /**
   * Kiểm tra email hợp lệ
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Kiểm tra số điện thoại hợp lệ
   */
  private isValidPhoneNumber(phone: string): boolean {
    // Validate Vietnamese phone number (10-11 digits, starts with 0)
    const phoneRegex = /^0\d{9,10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Format user data for display
   */
  formatUserForDisplay(user: IUser): IUser & {
    created_at_formatted?: string;
    status_label: string;
    status_color: string;
  } {
    const createdAtFormatted = user.created_at
      ? new Date(user.created_at).toLocaleDateString('en-US')
      : undefined;

    const statusMap: Record<string, { label: string; color: string }> = {
      unverified: { label: 'Unverified', color: 'warning' },
      active: { label: 'Active', color: 'success' },
      suspended: { label: 'Suspended', color: 'error' },
      banned: { label: 'Banned', color: 'error' }
    };

    const statusInfo = statusMap[user.status] || { label: user.status, color: 'default' };

    return {
      ...user,
      created_at_formatted: createdAtFormatted,
      status_label: statusInfo.label,
      status_color: statusInfo.color
    };
  }

  /**
   * Handle login success
   */
  async handleLoginSuccess(response: ILoginResponse): Promise<void> {
    if (response.success && response.data) {
      this.saveToken(response.data.token);
      this.saveUser(response.data.user);
    }
  }

  /**
   * Handle register success
   */
  async handleRegisterSuccess(response: IRegisterResponse): Promise<void> {
    if (response.success && response.data) {
      this.saveToken(response.data.token);
      this.saveUser(response.data.user);
    }
  }

  /**
   * Get authorization header
   */
  async getAuthHeader(): Promise<{ Authorization: string } | {}> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Export singleton instance
export const authService = new AuthService();