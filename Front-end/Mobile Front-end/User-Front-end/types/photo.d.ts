// Photo interface
export interface IPhoto {
  id: number;
  user_id: number;
  url: string;
  order_index: number;
  is_public: boolean;
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

// Query parameters for photos
export interface PhotoQueryParams {
  page?: number;
  limit?: number;
  user_id?: number;
  is_public?: boolean;
  sort_by?: "order_index" | "created_at";
  sort_order?: "asc" | "desc";
}

// Create photo request
export interface CreatePhotoRequest {
  user_id: number;
  url: string;
  order_index?: number;
  is_public?: boolean;
}

// Update photo request
export interface UpdatePhotoRequest {
  url?: string;
  order_index?: number;
  is_public?: boolean;
}

// Create multiple photos request
export interface CreateMultiplePhotosRequest {
  user_id: number;
  photos: Array<{
    url: string;
    order_index?: number;
    is_public?: boolean;
  }>;
}

// Photo with display info
export interface PhotoWithDisplay extends IPhoto {
  url_display: string;
  created_at_formatted: string;
  is_primary: boolean;
}

// Photo statistics
export interface PhotoStatistics {
  total: number;
  public: number;
  private: number;
  hasPrimary: boolean;
}
