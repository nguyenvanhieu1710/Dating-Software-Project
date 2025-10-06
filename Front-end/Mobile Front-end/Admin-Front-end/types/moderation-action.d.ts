// Moderation Action types
export interface IModerationAction {
    id: number;
    report_id: number;
    action: string;
    action_details: string;
    status: string;
    assigned_to: number;
    completed_at: string;
    error_message: string;
    created_at: string;
    created_by: number;
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
  
  // Query parameters for actions
  export interface ActionQueryParams {
    page?: number;
    limit?: number;
    status?: string;
    action?: string;
    report_id?: number;
    assigned_to?: number;
    sort_by?: 'id' | 'status' | 'action' | 'created_at';
    sort_order?: 'asc' | 'desc';
  }
  
  // Create/Update request types for actions
  export interface CreateActionRequest {
    report_id: number;
    action: string;
    action_details?: string;
    status?: string;
    assigned_to?: number;
    created_by: number;
  }
  
  export interface UpdateActionRequest {
    action?: string;
    action_details?: string;
    status?: string;
    assigned_to?: number;
    error_message?: string;
  }
  
  // Execute action request type
  export interface ExecuteActionRequest {
    report_id: number;
    action: string;
    action_details?: string;
    created_by: number;
  }
  
  // Search response type for actions
  export interface SearchActionsResponse {
    success: boolean;
    data: IModerationAction[];
    message: string;
  }