// User types
export interface IUser {
  id: number;
  email: string;
  phone_number: string;
  password_hash: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FlatUserProfile {
  id: number;
  email: string;
  phone_number: string;
  status: string;
  password_hash?: string;
  created_at: string;
  updated_at: string;

  user_id: number;
  first_name: string;
  dob: string;
  gender: string;
  bio: string;
  job_title: string;
  company: string;
  school: string;
  education: string;
  height_cm: number;
  relationship_goals: string;
  location: string;
  popularity_score: number;
  message_count: number;
  last_active_at: string;
  is_verified: boolean;
  is_online: boolean;
  last_seen: string | null;
  profile_created_at: string;
  profile_updated_at: string;
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

// Combined User with Profile type
export type UserWithProfile = IUser & { profile?: IProfile };

// Query parameters for search/filter
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  gender?: "male" | "female" | "other";
  is_verified?: boolean;
  is_online?: boolean;
  sort_by?: "created_at" | "last_active_at" | "popularity_score" | "email";
  sort_order?: "asc" | "desc";
  age_min?: number;
  age_max?: number;
  location?: string;
}

// Create/Update request types
export interface CreateUserRequest {
  email: string;
  phone_number?: string;
  password?: string;
  status?: string;
  profile?: Partial<IProfile>;
}

export interface UpdateUserRequest {
  email?: string;
  phone_number?: string;
  status?: string;
  profile?: Partial<IProfile>;
}

// Search response type
export interface SearchUsersResponse {
  success: boolean;
  data: UserWithProfile[];
  message: string;
}

// Profile interface (assumed based on userModel.js)
export interface IProfile {
  user_id: number;
  first_name?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  bio?: string;
  job_title?: string;
  company?: string;
  school?: string;
  education?: string;
  height_cm?: number;
  relationship_goals?: string;
  location?: string;
  popularity_score?: number;
  message_count?: number;
  last_active_at?: string;
  is_verified?: boolean;
  is_online?: boolean;
  last_seen?: string;
  created_at: string;
  updated_at: string;
}

// Interest/Goal request types
export interface InterestRequest {
  interest_id: number;
  name?: string;
}

export interface GoalRequest {
  goal_id: number;
  name?: string;
}
