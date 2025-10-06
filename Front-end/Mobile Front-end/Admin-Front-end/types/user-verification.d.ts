// User Verification types
export interface IUserVerification {
    id: number;
    user_id: number;
    verification_type: string; // photo, id, phone
    status: string; // pending, verified, rejected, not_submitted
    evidence_url: string;
    reviewed_by: number;
    reviewed_at: string;
    notes: string;
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
  export interface VerificationQueryParams {
    page?: number;
    limit?: number;
    user_id?: number;
    status?: string;
    verification_type?: string;
  }
  
  // Create/Update request types
  export interface CreateVerificationRequest {
    user_id: number;
    verification_type: string;
    evidence_url: string;
  }
  
  export interface UpdateVerificationRequest {
    status?: string;
    reviewed_by?: number;
    notes?: string;
  }
  
  // Search response type
  export interface SearchVerificationsResponse {
    success: boolean;
    data: IUserVerification[];
    message: string;
  }