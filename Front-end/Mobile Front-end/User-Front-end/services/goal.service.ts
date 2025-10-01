import { httpService } from './http.service';
import {
  IGoal,
  ApiResponse,
  PaginatedResponse,
  GoalQueryParams,
  CreateGoalRequest,
  UpdateGoalRequest,
  SearchGoalsResponse,
} from '@/types/goal';

class GoalService {
  private readonly basePath = '/goals';

  // ===== BASIC CRUD OPERATIONS =====

  /**
   * Lấy tất cả goals với pagination
   */
  async getAllGoals(params?: GoalQueryParams): Promise<ApiResponse<PaginatedResponse<IGoal>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<IGoal>>>(
      `${this.basePath}${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Lấy goal theo ID
   */
  async getGoalById(id: number): Promise<ApiResponse<IGoal>> {
    return httpService.get<ApiResponse<IGoal>>(`${this.basePath}/${id}`);
  }

  /**
   * Tìm kiếm goals theo keyword
   */
  async searchGoals(keyword: string): Promise<SearchGoalsResponse> {
    return httpService.get<SearchGoalsResponse>(
      `${this.basePath}/search?keyword=${encodeURIComponent(keyword)}`
    );
  }

  /**
   * Tạo goal mới
   */
  async createGoal(goalData: CreateGoalRequest): Promise<ApiResponse<IGoal>> {
    return httpService.post<ApiResponse<IGoal>>(this.basePath, goalData);
  }

  /**
   * Cập nhật goal
   */
  async updateGoal(id: number, goalData: UpdateGoalRequest): Promise<ApiResponse<IGoal>> {
    return httpService.put<ApiResponse<IGoal>>(`${this.basePath}/${id}`, goalData);
  }

  /**
   * Xóa goal (soft delete)
   */
  async deleteGoal(id: number): Promise<ApiResponse<IGoal>> {
    return httpService.delete<ApiResponse<IGoal>>(`${this.basePath}/${id}`);
  }

  // ===== VALIDATION METHODS =====

  /**
   * Validate goal data trước khi create/update
   */
  validateGoalData(goalData: CreateGoalRequest | UpdateGoalRequest): string[] {
    const errors: string[] = [];

    if (!goalData.name || !goalData.name.trim()) {
      errors.push('Goal name is required');
    } else if (goalData.name.length < 2) {
      errors.push('Goal name must be at least 2 characters');
    } else if (goalData.name.length > 100) {
      errors.push('Goal name must not exceed 100 characters');
    }

    if (goalData.category && goalData.category.length > 50) {
      errors.push('Category must not exceed 50 characters');
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
  validatePaginationParams(params: GoalQueryParams): string[] {
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
   * Build query string từ params object
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
   * Format goal data for display
   */
  formatGoalForDisplay(goal: IGoal): IGoal & {
    created_at_formatted?: string;
    updated_at_formatted?: string;
    category_display: string;
  } {
    const createdAtFormatted = goal.created_at
      ? this.formatDate(new Date(goal.created_at))
      : undefined;

    const updatedAtFormatted = goal.updated_at
      ? this.formatDate(new Date(goal.updated_at))
      : undefined;

    const categoryDisplay = goal.category || 'Uncategorized';

    return {
      ...goal,
      created_at_formatted: createdAtFormatted,
      updated_at_formatted: updatedAtFormatted,
      category_display: categoryDisplay,
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
   * Sort goals by name
   */
  sortGoalsByName(goals: IGoal[], ascending: boolean = true): IGoal[] {
    return [...goals].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return ascending ? comparison : -comparison;
    });
  }

  /**
   * Group goals by category
   */
  groupGoalsByCategory(goals: IGoal[]): Record<string, IGoal[]> {
    return goals.reduce((acc, goal) => {
      const category = goal.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(goal);
      return acc;
    }, {} as Record<string, IGoal[]>);
  }

  /**
   * Filter goals by category
   */
  filterGoalsByCategory(goals: IGoal[], category: string): IGoal[] {
    return goals.filter((goal) => goal.category === category);
  }

  /**
   * Get unique categories from goals
   */
  getUniqueCategories(goals: IGoal[]): string[] {
    const categories = goals.map((goal) => goal.category || 'Uncategorized');
    return Array.from(new Set(categories)).sort();
  }

  /**
   * Search goals locally (client-side filtering)
   */
  searchGoalsLocally(goals: IGoal[], keyword: string): IGoal[] {
    const lowerKeyword = keyword.toLowerCase();
    return goals.filter((goal) =>
      goal.name.toLowerCase().includes(lowerKeyword) ||
      (goal.category && goal.category.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * Get pagination info text
   */
  getPaginationInfo(page: number, limit: number, total: number): string {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return `Showing ${start}-${end} of ${total} goals`;
  }
}

// Export singleton instance
export const goalService = new GoalService();