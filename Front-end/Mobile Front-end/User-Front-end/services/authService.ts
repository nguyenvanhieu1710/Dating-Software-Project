import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      email: string;
      phone_number: string;
      status: string;
      created_at: string;
      updated_at: string;
    };
  };
}

class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'user_data';

  // Login user
  public static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/user/login', credentials);
      await this.storeAuthData(response);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  public static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/user/register', userData);
      await this.storeAuthData(response);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Verify OTP
  public static async verifyOtp(userId: string, otp: string): Promise<void> {
    try {
      await apiClient.put(`/user/${userId}/verify`, { otp });
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }

  // Reset password
  public static async resetPassword(email: string): Promise<void> {
    try {
      await apiClient.post('/user/reset-password', { email });
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Change password
  public static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      await apiClient.put(`/user/${userId}/change-password`, {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Get current user
  public static async getCurrentUser(): Promise<any> {
    try {
      return await apiClient.get('/user/me');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  public static async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  // Get stored token
  public static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  // Logout user
  public static async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.TOKEN_KEY);
      await AsyncStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Private helper to store auth data
  private static async storeAuthData(authData: AuthResponse): Promise<void> {
    try {
      if (authData.data && authData.data.token) {
        await AsyncStorage.setItem(this.TOKEN_KEY, authData.data.token);
        await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(authData.data.user));
      }
    } catch (error) {
      console.error('Store auth data error:', error);
      throw error;
    }
  }
}

export default AuthService;
