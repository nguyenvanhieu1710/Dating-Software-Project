// Goal types
export interface IGoal {
    id: number;
    name: string;
    category?: string;
    created_at?: string;
    updated_at?: string;
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
  export interface GoalQueryParams {
    page?: number;
    limit?: number;
    keyword?: string;
  }
  
  // Create/Update request types
  export interface CreateGoalRequest {
    name: string;
    category?: string;
  }
  
  export interface UpdateGoalRequest {
    name: string;
    category?: string;
  }
  
  // Search response type
  export interface SearchGoalsResponse {
    success: boolean;
    data: IGoal[];
    message: string;
  }