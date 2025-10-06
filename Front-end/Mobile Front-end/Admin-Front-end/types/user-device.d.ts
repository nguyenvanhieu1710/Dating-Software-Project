// User Device types
export interface IUserDevice {
    id: number;
    user_id: number;
    platform: string;
    device_model: string;
    app_version: string;
    last_ip: string;
    last_active_at: string;
    created_at: string;
    updated_at: string;
  }
  
  // API Response types
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
  }
  
  // Pagination types
  export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
  }
  
  // Query parameters
  export interface DeviceQueryParams {
    page?: number;
    limit?: number;
    user_id?: number;
    platform?: string;
  }
  
  // Create/Update request types
  export interface CreateDeviceRequest {
    user_id: number;
    platform: string;
    device_model: string;
    app_version: string;
    last_ip: string;
  }
  
  export interface UpdateDeviceRequest {
    platform?: string;
    device_model?: string;
    app_version?: string;
    last_ip?: string;
  }
  
  // Search response type
  export interface SearchDevicesResponse {
    success: boolean;
    data: IUserDevice[];
    message: string;
  }