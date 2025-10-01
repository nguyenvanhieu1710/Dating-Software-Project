import { httpService } from './http.service';
import {
  IInterest,
  ApiResponse,
  PaginatedResponse,
  InterestQueryParams,
  CreateInterestRequest,
  UpdateInterestRequest,
  SearchInterestsResponse,
} from '@/types/interest';

class InterestService {
  private readonly basePath = '/interests';

  // ===== BASIC CRUD OPERATIONS =====

  /**
   * Get all interests with pagination
   */
  async getAllInterests(params?: InterestQueryParams): Promise<ApiResponse<PaginatedResponse<IInterest>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<IInterest>>>(
      `${this.basePath}${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get interest by ID
   */
  async getInterestById(id: number): Promise<ApiResponse<IInterest>> {
    return httpService.get<ApiResponse<IInterest>>(`${this.basePath}/${id}`);
  }

  /**
   * Search interests by keyword
   */
  async searchInterests(keyword: string): Promise<SearchInterestsResponse> {
    return httpService.get<SearchInterestsResponse>(
      `${this.basePath}/search?keyword=${encodeURIComponent(keyword)}`
    );
  }

  /**
   * Create a new interest
   */
  async createInterest(interestData: CreateInterestRequest): Promise<ApiResponse<IInterest>> {
    return httpService.post<ApiResponse<IInterest>>(this.basePath, interestData);
  }

  /**
   * Update an interest
   */
  async updateInterest(id: number, interestData: UpdateInterestRequest): Promise<ApiResponse<IInterest>> {
    return httpService.put<ApiResponse<IInterest>>(`${this.basePath}/${id}`, interestData);
  }

  /**
   * Soft delete an interest
   */
  async deleteInterest(id: number): Promise<ApiResponse<IInterest>> {
    return httpService.delete<ApiResponse<IInterest>>(`${this.basePath}/${id}`);
  }

  // ===== VALIDATION METHODS =====

  /**
   * Validate interest data before create/update
   */
  validateInterestData(interestData: CreateInterestRequest | UpdateInterestRequest): string[] {
    const errors: string[] = [];

    if (!interestData.name || !interestData.name.trim()) {
      errors.push('Interest name is required');
    } else if (interestData.name.length < 2) {
      errors.push('Interest name must be at least 2 characters');
    } else if (interestData.name.length > 100) {
      errors.push('Interest name must not exceed 100 characters');
    }

    if (interestData.category && interestData.category.length > 50) {
      errors.push('Category must not exceed 50 characters');
    }

    if (interestData.is_active !== undefined && typeof interestData.is_active !== 'boolean') {
      errors.push('is_active must be a boolean value');
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
  validatePaginationParams(params: InterestQueryParams): string[] {
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
   * Format interest data for display
   */
  formatInterestForDisplay(interest: IInterest): IInterest & {
    created_at_formatted?: string;
    updated_at_formatted?: string;
    category_display: string;
    status_display: string;
  } {
    const createdAtFormatted = interest.created_at
      ? this.formatDate(new Date(interest.created_at))
      : undefined;

    const updatedAtFormatted = interest.updated_at
      ? this.formatDate(new Date(interest.updated_at))
      : undefined;

    const categoryDisplay = interest.category || 'Uncategorized';
    const statusDisplay = interest.is_active ? 'Active' : 'Inactive';

    return {
      ...interest,
      created_at_formatted: createdAtFormatted,
      updated_at_formatted: updatedAtFormatted,
      category_display: categoryDisplay,
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
   * Sort interests by name
   */
  sortInterestsByName(interests: IInterest[], ascending: boolean = true): IInterest[] {
    return [...interests].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return ascending ? comparison : -comparison;
    });
  }

  /**
   * Group interests by category
   */
  groupInterestsByCategory(interests: IInterest[]): Record<string, IInterest[]> {
    return interests.reduce((acc, interest) => {
      const category = interest.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(interest);
      return acc;
    }, {} as Record<string, IInterest[]>);
  }

  /**
   * Filter interests by category
   */
  filterInterestsByCategory(interests: IInterest[], category: string): IInterest[] {
    return interests.filter((interest) => interest.category === category);
  }

  /**
   * Filter interests by active status
   */
  filterInterestsByStatus(interests: IInterest[], isActive: boolean): IInterest[] {
    return interests.filter((interest) => interest.is_active === isActive);
  }

  /**
   * Get unique categories from interests
   */
  getUniqueCategories(interests: IInterest[]): string[] {
    const categories = interests.map((interest) => interest.category || 'Uncategorized');
    return Array.from(new Set(categories)).sort();
  }

  /**
   * Search interests locally (client-side filtering)
   */
  searchInterestsLocally(interests: IInterest[], keyword: string): IInterest[] {
    const lowerKeyword = keyword.toLowerCase();
    return interests.filter((interest) =>
      interest.name.toLowerCase().includes(lowerKeyword) ||
      (interest.category && interest.category.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * Get pagination info text
   */
  getPaginationInfo(page: number, limit: number, total: number): string {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return `Showing ${start}-${end} of ${total} interests`;
  }
}

// Export singleton instance
export const interestService = new InterestService();