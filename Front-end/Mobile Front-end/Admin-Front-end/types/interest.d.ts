// Interest types
export interface IInterest {
    id: number;
    name: string;
    category?: string;
    is_active: boolean;
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
  export interface InterestQueryParams {
    page?: number;
    limit?: number;
    keyword?: string;
  }
  
  // Create/Update request types
  export interface CreateInterestRequest {
    name: string;
    category?: string;
    is_active?: boolean;
  }
  
  export interface UpdateInterestRequest {
    name?: string;
    category?: string;
    is_active?: boolean;
  }
  
  // Search response type
  export interface SearchInterestsResponse {
    success: boolean;
    data: IInterest[];
    message: string;
  }