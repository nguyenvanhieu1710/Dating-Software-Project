// Notification types
export interface INotification {
  id: number;
  user_id: number;
  title: string;
  body: string;
  data?: Record<string, any>;
  is_read?: boolean;
  sent_at: string;
  read_at?: string;
  created_at: string;
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
export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  is_read?: boolean;
  type?: string;
  user_id?: number;
}

// Create/Update request types
export interface CreateNotificationRequest {
  user_id: number;
  title: string;
  body: string;
  data?: Record<string, any>;
  is_read?: boolean;
}

export interface UpdateNotificationRequest {
  title?: string;
  body?: string;
  data?: Record<string, any>;
  is_read?: boolean;
}

// Search response type
export interface SearchNotificationsResponse {
  success: boolean;
  data: INotification[];
  message: string;
}
