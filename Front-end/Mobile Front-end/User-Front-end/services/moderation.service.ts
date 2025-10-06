import { httpService } from './http.service';
import {
  IModerationReport,
  ApiResponse,
  PaginatedResponse,
  ReportQueryParams,
  CreateReportRequest,
  UpdateReportRequest,
  SearchReportsResponse,
} from '@/types/moderation-report';
import {
  IModerationAction,
  ActionQueryParams,
  CreateActionRequest,
  UpdateActionRequest,
  ExecuteActionRequest,
  SearchActionsResponse,
} from '@/types/moderation-action';

class ModerationService {
  private readonly basePath = '/moderation';

  // ===== MODERATION REPORTS OPERATIONS =====

  /**
   * Get all reports with pagination
   */
  async getAllReports(params?: ReportQueryParams): Promise<ApiResponse<PaginatedResponse<IModerationReport>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<IModerationReport>>>(
      `${this.basePath}/reports${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get pending reports
   */
  async getPendingReports(params?: ReportQueryParams): Promise<ApiResponse<PaginatedResponse<IModerationReport>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<IModerationReport>>>(
      `${this.basePath}/reports/pending${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get reports by user ID
   */
  async getReportsByUserId(userId: number, params?: ReportQueryParams): Promise<ApiResponse<PaginatedResponse<IModerationReport>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<IModerationReport>>>(
      `${this.basePath}/reports/user/${userId}${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get report by ID
   */
  async getReportById(id: number): Promise<ApiResponse<IModerationReport>> {
    return httpService.get<ApiResponse<IModerationReport>>(`${this.basePath}/reports/${id}`);
  }

  /**
   * Search reports by keyword
   */
  async searchReports(keyword: string): Promise<SearchReportsResponse> {
    return httpService.get<SearchReportsResponse>(
      `${this.basePath}/reports/search?keyword=${encodeURIComponent(keyword)}`
    );
  }

  /**
   * Create a new report
   */
  async createReport(reportData: CreateReportRequest): Promise<ApiResponse<IModerationReport>> {
    return httpService.post<ApiResponse<IModerationReport>>(`${this.basePath}/reports`, reportData);
  }

  /**
   * Update a report
   */
  async updateReport(id: number, reportData: UpdateReportRequest): Promise<ApiResponse<IModerationReport>> {
    return httpService.put<ApiResponse<IModerationReport>>(`${this.basePath}/reports/${id}`, reportData);
  }

  /**
   * Delete a report
   */
  async deleteReport(id: number): Promise<ApiResponse<IModerationReport>> {
    return httpService.delete<ApiResponse<IModerationReport>>(`${this.basePath}/reports/${id}`);
  }

  // ===== MODERATION ACTIONS OPERATIONS =====

  /**
   * Get all actions with pagination
   */
  async getAllActions(params?: ActionQueryParams): Promise<ApiResponse<PaginatedResponse<IModerationAction>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<IModerationAction>>>(
      `${this.basePath}/actions${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get actions by report ID
   */
  async getActionsByReportId(reportId: number, params?: ActionQueryParams): Promise<ApiResponse<PaginatedResponse<IModerationAction>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<IModerationAction>>>(
      `${this.basePath}/actions/report/${reportId}${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get action by ID
   */
  async getActionById(id: number): Promise<ApiResponse<IModerationAction>> {
    return httpService.get<ApiResponse<IModerationAction>>(`${this.basePath}/actions/${id}`);
  }

  /**
   * Search actions by keyword
   */
  async searchActions(keyword: string): Promise<SearchActionsResponse> {
    return httpService.get<SearchActionsResponse>(
      `${this.basePath}/actions/search?keyword=${encodeURIComponent(keyword)}`
    );
  }

  /**
   * Create a new action
   */
  async createAction(actionData: CreateActionRequest): Promise<ApiResponse<IModerationAction>> {
    return httpService.post<ApiResponse<IModerationAction>>(`${this.basePath}/actions`, actionData);
  }

  /**
   * Execute an action
   */
  async executeAction(actionData: ExecuteActionRequest): Promise<ApiResponse<IModerationAction>> {
    return httpService.post<ApiResponse<IModerationAction>>(`${this.basePath}/actions/execute`, actionData);
  }

  /**
   * Update an action
   */
  async updateAction(id: number, actionData: UpdateActionRequest): Promise<ApiResponse<IModerationAction>> {
    return httpService.put<ApiResponse<IModerationAction>>(`${this.basePath}/actions/${id}`, actionData);
  }

  /**
   * Delete an action
   */
  async deleteAction(id: number): Promise<ApiResponse<IModerationAction>> {
    return httpService.delete<ApiResponse<IModerationAction>>(`${this.basePath}/actions/${id}`);
  }

  // ===== VALIDATION METHODS =====

  /**
   * Validate report data before create/update
   */
  validateReportData(reportData: CreateReportRequest | UpdateReportRequest): string[] {
    const errors: string[] = [];

    if ('reporter_id' in reportData && (!reportData.reporter_id || reportData.reporter_id < 1)) {
      errors.push('Valid reporter_id is required');
    }

    if ('reported_user_id' in reportData && (!reportData.reported_user_id || reportData.reported_user_id < 1)) {
      errors.push('Valid reported_user_id is required');
    }

    if ('content_type' in reportData && (!reportData.content_type || reportData.content_type.trim() === '')) {
      errors.push('Content type is required');
    }

    if ('reason' in reportData && (!reportData.reason || reportData.reason.trim() === '')) {
      errors.push('Reason is required');
    }

    if ('description' in reportData && reportData.description && reportData.description.length > 1000) {
      errors.push('Description must not exceed 1000 characters');
    }

    if ('status' in reportData && reportData.status && !['pending', 'in_progress', 'resolved', 'dismissed'].includes(reportData.status)) {
      errors.push('Invalid status value');
    }

    if ('priority' in reportData && reportData.priority && !['low', 'medium', 'high', 'critical'].includes(reportData.priority)) {
      errors.push('Invalid priority value');
    }

    return errors;
  }

  /**
   * Validate action data before create/update
   */
  validateActionData(actionData: CreateActionRequest | UpdateActionRequest): string[] {
    const errors: string[] = [];

    if ('report_id' in actionData && (!actionData.report_id || actionData.report_id < 1)) {
      errors.push('Valid report_id is required');
    }

    if ('action' in actionData && (!actionData.action || actionData.action.trim() === '')) {
      errors.push('Action is required');
    }

    if ('created_by' in actionData && (!actionData.created_by || actionData.created_by < 1)) {
      errors.push('Valid created_by is required');
    }

    if ('status' in actionData && actionData.status && !['pending', 'in_progress', 'completed', 'failed'].includes(actionData.status)) {
      errors.push('Invalid status value');
    }

    return errors;
  }

  /**
   * Validate search keyword
   */
  validateSearchKeyword(keyword: string): string[] {
    const errors: string[] = [];

    if (!keyword || !keyword.trim()) {
      errors.push('Search keyword is required');
    } else if (keyword.length < 2) {
      errors.push('Search keyword must be at least 2 characters');
    }

    return errors;
  }

  /**
   * Validate pagination params
   */
  validatePaginationParams(params: ReportQueryParams | ActionQueryParams): string[] {
    const errors: string[] = [];

    if (params.page !== undefined && params.page < 1) {
      errors.push('Page must be greater than 0');
    }

    if (params.limit !== undefined && (params.limit < 1 || params.limit > 100)) {
      errors.push('Limit must be between 1 and 100');
    }

    return errors;
  }

  // ===== UTILITY METHODS =====

  /**
   * Build query string from params object
   */
  private buildQueryString(params?: Record<string, any>): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }

  /**
   * Format report data for display
   */
  formatReportForDisplay(report: IModerationReport): IModerationReport & {
    created_at_formatted?: string;
    updated_at_formatted?: string;
    resolved_at_formatted?: string;
    status_display: string;
    priority_display: string;
  } {
    const createdAtFormatted = report.created_at
      ? this.formatDate(new Date(report.created_at))
      : undefined;

    const updatedAtFormatted = report.updated_at
      ? this.formatDate(new Date(report.updated_at))
      : undefined;

    const resolvedAtFormatted = report.resolved_at
      ? this.formatDate(new Date(report.resolved_at))
      : undefined;

    const statusDisplay = report.status.charAt(0).toUpperCase() + report.status.slice(1);
    const priorityDisplay = report.priority.charAt(0).toUpperCase() + report.priority.slice(1);

    return {
      ...report,
      created_at_formatted: createdAtFormatted,
      updated_at_formatted: updatedAtFormatted,
      resolved_at_formatted: resolvedAtFormatted,
      status_display: statusDisplay,
      priority_display: priorityDisplay,
    };
  }

  /**
   * Format action data for display
   */
  formatActionForDisplay(action: IModerationAction): IModerationAction & {
    created_at_formatted?: string;
    completed_at_formatted?: string;
    status_display: string;
  } {
    const createdAtFormatted = action.created_at
      ? this.formatDate(new Date(action.created_at))
      : undefined;

    const completedAtFormatted = action.completed_at
      ? this.formatDate(new Date(action.completed_at))
      : undefined;

    const statusDisplay = action.status.charAt(0).toUpperCase() + action.status.slice(1);

    return {
      ...action,
      created_at_formatted: createdAtFormatted,
      completed_at_formatted: completedAtFormatted,
      status_display: statusDisplay,
    };
  }

  /**
   * Format date to readable string
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return this.formatDate(date);
  }

  /**
   * Sort reports by created_at
   */
  sortReportsByCreatedAt(reports: IModerationReport[], ascending: boolean = false): IModerationReport[] {
    return [...reports].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Group reports by status
   */
  groupReportsByStatus(reports: IModerationReport[]): Record<string, IModerationReport[]> {
    return reports.reduce((acc, report) => {
      const status = report.status || 'Unknown';
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(report);
      return acc;
    }, {} as Record<string, IModerationReport[]>);
  }

  /**
   * Filter reports by status
   */
  filterReportsByStatus(reports: IModerationReport[], status: string): IModerationReport[] {
    return reports.filter((report) => report.status === status);
  }

  /**
   * Get unique priorities from reports
   */
  getUniquePriorities(reports: IModerationReport[]): string[] {
    const priorities = reports.map((report) => report.priority || 'Unknown');
    return Array.from(new Set(priorities)).sort();
  }

  /**
   * Search reports locally (client-side filtering)
   */
  searchReportsLocally(reports: IModerationReport[], keyword: string): IModerationReport[] {
    const lowerKeyword = keyword.toLowerCase();
    return reports.filter((report) =>
      report.reason.toLowerCase().includes(lowerKeyword) ||
      report.description.toLowerCase().includes(lowerKeyword) ||
      report.content_type.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * Sort actions by created_at
   */
  sortActionsByCreatedAt(actions: IModerationAction[], ascending: boolean = false): IModerationAction[] {
    return [...actions].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Group actions by status
   */
  groupActionsByStatus(actions: IModerationAction[]): Record<string, IModerationAction[]> {
    return actions.reduce((acc, action) => {
      const status = action.status || 'Unknown';
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(action);
      return acc;
    }, {} as Record<string, IModerationAction[]>);
  }

  /**
   * Filter actions by status
   */
  filterActionsByStatus(actions: IModerationAction[], status: string): IModerationAction[] {
    return actions.filter((action) => action.status === status);
  }

  /**
   * Get unique actions from moderation actions
   */
  getUniqueActions(actions: IModerationAction[]): string[] {
    const actionTypes = actions.map((action) => action.action || 'Unknown');
    return Array.from(new Set(actionTypes)).sort();
  }

  /**
   * Search actions locally (client-side filtering)
   */
  searchActionsLocally(actions: IModerationAction[], keyword: string): IModerationAction[] {
    const lowerKeyword = keyword.toLowerCase();
    return actions.filter((action) =>
      action.action.toLowerCase().includes(lowerKeyword) ||
      (action.action_details && action.action_details.toLowerCase().includes(lowerKeyword)) ||
      (action.error_message && action.error_message.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * Get pagination info text
   */
  getPaginationInfo(page: number, limit: number, total: number): string {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return `Showing ${start}-${end} of ${total} items`;
  }
}

// Export singleton instance
export const moderationService = new ModerationService();