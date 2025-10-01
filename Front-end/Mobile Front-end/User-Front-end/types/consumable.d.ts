// Consumable types
export interface IConsumable {
  user_id: number;
  super_likes_balance: number;
  boosts_balance: number;
  last_super_like_reset: string;
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
export interface ConsumableQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  user_id?: number;
  min_super_likes?: number;
  max_super_likes?: number;
  min_boosts?: number;
  max_boosts?: number;
  sort_by?:
    | "user_id"
    | "super_likes_balance"
    | "boosts_balance"
    | "last_super_like_reset"
    | "updated_at";
  sort_order?: "asc" | "desc";
}

// Create/Update request types
export interface CreateConsumableRequest {
  user_id: number;
  super_likes_balance?: number;
  boosts_balance?: number;
  last_super_like_reset?: string;
}

export interface UpdateConsumableRequest {
  super_likes_balance?: number;
  boosts_balance?: number;
  last_super_like_reset?: string;
}

// Statistics response type
export interface ConsumableStats {
  total_super_likes: number;
  total_boosts: number;
  total_users_with_consumables: number;
}

// Can use response type
export interface CanUseResponse {
  can_use: boolean;
  current_balance?: number;
  message?: string;
}
