import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

class HttpService {
  private instance: AxiosInstance;
  private static _instance: HttpService;

  private constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - tự động thêm auth token
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - xử lý lỗi tập trung
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('auth_token');
          // TODO: Navigate to login screen
          // You can add navigation logic here
        }

        // Handle other common errors
        if (error.response?.status >= 500) {
          // Server error - có thể show toast notification
          console.error('Server Error:', error.response.data);
        }

        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): HttpService {
    if (!HttpService._instance) {
      HttpService._instance = new HttpService();
    }
    return HttpService._instance;
  }

  // GET method
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  // POST method
  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  // PUT method
  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  // PATCH method
  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  // DELETE method
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  // Upload file method (tối ưu cho React Native)
  public async upload<T>(
    url: string,
    file: {
      uri: string;
      type?: string;
      name?: string;
    },
    fieldName: string = 'file',
    additionalData?: Record<string, any>
  ): Promise<T> {
    const formData = new FormData();
    
    formData.append(fieldName, {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.name || 'upload.jpg',
    } as any);

    // Thêm data bổ sung nếu có
    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });
    }

    const response = await this.instance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Method để upload nhiều file
  public async uploadMultiple<T>(
    url: string,
    files: Array<{
      uri: string;
      type?: string;
      name?: string;
    }>,
    fieldName: string = 'files',
    additionalData?: Record<string, any>
  ): Promise<T> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`${fieldName}[${index}]`, {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.name || `upload_${index}.jpg`,
      } as any);
    });

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });
    }

    const response = await this.instance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Method để lấy raw axios instance (nếu cần custom)
  public getAxiosInstance(): AxiosInstance {
    return this.instance;
  }

  // Method để update base URL
  public updateBaseURL(newBaseURL: string) {
    this.instance.defaults.baseURL = newBaseURL;
  }

  // Method để update timeout
  public updateTimeout(timeout: number) {
    this.instance.defaults.timeout = timeout;
  }
}

// Export singleton instance
export const httpService = HttpService.getInstance();

// Export class nếu cần tạo instance khác
export { HttpService };