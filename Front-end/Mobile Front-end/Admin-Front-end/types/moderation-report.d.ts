// Moderation Report types
export interface IModerationReport {
    id: number;
    reporter_id: number;
    reported_user_id: number;
    reported_content_id: number;
    content_type: string;
    reason: string;
    description: string;
    status: string;
    priority: string;
    admin_notes: string;
    resolved_by: number;
    resolved_at: string;
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
  
  // Query parameters for reports
  export interface ReportQueryParams {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    reporter_id?: number;
    reported_user_id?: number;
    content_type?: string;
    sort_by?: 'id' | 'status' | 'priority' | 'created_at';
    sort_order?: 'asc' | 'desc';
  }
  
  // Create/Update request types for reports
  export interface CreateReportRequest {
    reporter_id: number;
    reported_user_id: number;
    reported_content_id?: number;
    content_type: string;
    reason: string;
    description?: string;
  }
  
  // UpdateReportRequest makes most fields optional
  export interface UpdateReportRequest {
    status?: string;
    priority?: string;
    admin_notes?: string;
    resolved_by?: number;
    resolved_at?: string;
  }
  
  // Search response type for reports
  export interface SearchReportsResponse {
    success: boolean;
    data: IModerationReport[];
    message: string;
  }