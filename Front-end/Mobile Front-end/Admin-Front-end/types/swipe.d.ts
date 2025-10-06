export interface ISwipe {
    id: number;
    swiper_user_id: number;
    swiped_user_id: number;
    action: 'like' | 'pass' | 'superlike';
    created_at: string;
}

// Response types for API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Pagination response
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

// Query parameters for swipes
export interface SwipeQueryParams {
  page?: number;
  limit?: number;
  swiper_user_id?: number;
  swiped_user_id?: number;
  action?: 'like' | 'pass' | 'superlike';
  sort_by?: 'id' | 'swiper_user_id' | 'swiped_user_id' | 'action' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

// Create swipe request
export interface CreateSwipeRequest {
  swiper_user_id: number;
  swiped_user_id: number;
  action: 'like' | 'pass' | 'superlike';
}

// Swipe statistics
export interface SwipeStats {
  action: string;
  count: number;
}

// User with profile info (for swiped users)
export interface SwipedUser extends ISwipe {
  first_name?: string;
  dob?: string;
  gender?: string;
  bio?: string;
  job_title?: string;
  school?: string;
  photo_url?: string;
}

// Potential match
export interface PotentialMatch {
  user_id: number;
  first_name?: string;
  dob?: string;
  gender?: string;
  bio?: string;
  job_title?: string;
  school?: string;
  email?: string;
  phone_number?: string;
  photo_url?: string;
  popularity_score?: number;
  last_active_at?: string;
}

// Swipe with match result
export interface SwipeResult {
  swipe: ISwipe;
  match: any | null;
  isMatch: boolean;
}