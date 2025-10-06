import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

class ApiClient {
  private instance: AxiosInstance;
  private static _instance: ApiClient;

  private constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000, // Longer timeout for admin operations
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to add auth token
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('admin_auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        // Add admin role header
        config.headers['X-Admin-Request'] = 'true';
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('admin_auth_token');
          await AsyncStorage.removeItem('admin_user_id');
          // Redirect to admin login
        }
        
        // Handle 403 Forbidden (insufficient permissions)
        if (error.response?.status === 403) {
          console.error('Admin access denied:', error.response.data);
        }
        
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient._instance) {
      ApiClient._instance = new ApiClient();
    }
    return ApiClient._instance;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  // File upload method for admin operations
  public async upload<T>(
    url: string,
    file: any,
    fieldName: string = 'file',
    data?: any
  ): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, {
      uri: file.uri,
      type: file.type || 'application/octet-stream',
      name: file.name || 'upload',
    } as any);

    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }

    const response = await this.instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Bulk operations for admin
  public async bulkOperation<T>(
    url: string,
    operations: any[],
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, { operations }, config);
    return response.data;
  }

  // Export data
  public async exportData<T>(
    url: string,
    format: 'csv' | 'json' | 'xlsx' = 'csv',
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.get<T>(`${url}?format=${format}`, {
      ...config,
      responseType: 'blob',
    });
    return response.data;
  }
}

export const apiClient = ApiClient.getInstance();
