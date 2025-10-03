// User Block types
export interface IUserBlock {
  id: number;
  blocker_id: number;
  blocked_id: number;
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
export interface BlockQueryParams {
  page?: number;
  limit?: number;
  blocker_id?: number;
  blocked_id?: number;
}

// Create request type (no update for blocks, typically)
export interface CreateBlockRequest {
  blocker_id: number;
  blocked_id: number;
}

// Search response type
export interface SearchBlocksResponse {
  success: boolean;
  data: IUserBlock[];
  message: string;
}
