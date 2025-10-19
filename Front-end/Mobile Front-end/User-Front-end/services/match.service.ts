import { httpService } from './http.service';
import {
  IMatch,
  ApiResponse,
  MatchQueryParams,
  MatchStats,
  MutualMatchResult,
} from '@/types/matche';

class MatchService {
  private readonly basePath = '/match';

  // ===== MATCH OPERATIONS =====

  /**
   * Get all matches for a user
   */
  async getMatchesByUserId(userId: number, params?: MatchQueryParams): Promise<ApiResponse<IMatch[]>> {
    this.validateId(userId);
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<IMatch[]>>(
      `${this.basePath}/users/${userId}/matches${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get match statistics for a user
   */
  async getMatchStats(userId: number): Promise<ApiResponse<MatchStats>> {
    this.validateId(userId);
    return httpService.get<ApiResponse<MatchStats>>(
      `${this.basePath}/users/${userId}/matches/stats`
    );
  }

  /**
   * Get match by ID
   */
  async getMatchById(userId: number, matchId: number): Promise<ApiResponse<IMatch>> {
    this.validateId(userId);
    this.validateId(matchId);
    return httpService.get<ApiResponse<IMatch>>(
      `${this.basePath}/users/${userId}/matches/${matchId}`
    );
  }

  /**
   * Unmatch
   */
  async unmatch(userId: number, matchId: number): Promise<ApiResponse<void>> {
    this.validateId(userId);
    this.validateId(matchId);
    return httpService.delete<ApiResponse<void>>(
      `${this.basePath}/users/${userId}/matches/${matchId}`
    );
  }

  /**
   * Check mutual match between two users
   */
  async checkMutualMatch(user1Id: number, user2Id: number): Promise<ApiResponse<MutualMatchResult>> {
    this.validateId(user1Id);
    this.validateId(user2Id);
    return httpService.get<ApiResponse<MutualMatchResult>>(
      `${this.basePath}/users/${user1Id}/mutual/${user2Id}`
    );
  }

  // ===== VALIDATION METHODS =====

  /**
   * Validate ID
   */
  private validateId(id: number): void {
    if (!id || id < 1 || isNaN(id)) {
      throw new Error('Valid ID is required');
    }
  }

  /**
   * Validate match data
   */
  validateMatchData(matchData: Partial<IMatch>): string[] {
    const errors: string[] = [];
    if (matchData.user1_id && (matchData.user1_id < 1 || isNaN(matchData.user1_id))) {
      errors.push('Valid user1_id is required');
    }
    if (matchData.user2_id && (matchData.user2_id < 1 || isNaN(matchData.user2_id))) {
      errors.push('Valid user2_id is required');
    }
    if (matchData.user1_id && matchData.user2_id && matchData.user1_id === matchData.user2_id) {
      errors.push('Users cannot match with themselves');
    }
    if (matchData.status && !['active', 'inactive'].includes(matchData.status)) {
      errors.push('Status must be either active or inactive');
    }
    return errors;
  }

  /**
   * Build query string from parameters
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
   * Format date for display
   */
  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Format relative time for display
   */
  formatRelativeTime(date: string | Date): string {
    const now = new Date();
    const inputDate = new Date(date);
    const diffMs = now.getTime() - inputDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return this.formatDate(inputDate);
  }

  /**
   * Format match for display
   */
  formatMatchForDisplay(match: IMatch): IMatch & {
    created_at_formatted: string;
    last_message_at_formatted: string;
  } {
    return {
      ...match,
      created_at_formatted: this.formatRelativeTime(match.created_at),
      last_message_at_formatted: match.last_message_at
        ? this.formatRelativeTime(match.last_message_at)
        : '-',
    };
  }
}

// Export singleton instance
export const matchService = new MatchService();