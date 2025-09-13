import { apiClient } from './apiClient';

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  matchedAt: string;
  lastMessage?: {
    content: string;
    sentAt: string;
    isRead: boolean;
  };
  user: {
    id: string;
    name: string;
    photos: string[];
  };
}

export interface SwipeAction {
  targetUserId: string;
  action: 'like' | 'pass' | 'super_like';
}

class MatchService {
  // Get all matches for current user
  public static async getMatches(): Promise<Match[]> {
    try {
      const matches = await apiClient.get<{ data: Match[] }>('/matches');
      console.log('Matches:', matches.data);
      return matches.data;
    } catch (error) {
      console.error('Get matches error:', error);
      throw error;
    }
  }

  // Get a specific match by ID
  public static async getMatch(matchId: string): Promise<Match> {
    try {
      return await apiClient.get(`/matches/${matchId}`);
    } catch (error) {
      console.error('Get match error:', error);
      throw error;
    }
  }

  // Swipe right (like) on a profile
  public static async likeProfile(targetUserId: string): Promise<{ isMatch: boolean; matchId?: string }> {
    try {
      return await apiClient.post('/swipes', { targetUserId, action: 'like' });
    } catch (error) {
      console.error('Like profile error:', error);
      throw error;
    }
  }

  // Swipe left (pass) on a profile
  public static async passProfile(targetUserId: string): Promise<void> {
    try {
      await apiClient.post('/swipes', { targetUserId, action: 'pass' });
    } catch (error) {
      console.error('Pass profile error:', error);
      throw error;
    }
  }

  // Super like a profile
  public static async superLikeProfile(targetUserId: string): Promise<{ isMatch: boolean; matchId?: string }> {
    try {
      return await apiClient.post('/swipes', { targetUserId, action: 'super_like' });
    } catch (error) {
      console.error('Super like error:', error);
      throw error;
    }
  }

  // Unmatch with a user
  public static async unmatch(matchId: string): Promise<void> {
    try {
      await apiClient.delete(`/matches/${matchId}`);
    } catch (error) {
      console.error('Unmatch error:', error);
      throw error;
    }
  }

  // Check if there's a match between current user and another user
  public static async checkMatch(userId: string): Promise<{ isMatch: boolean; matchId?: string }> {
    try {
      return await apiClient.get(`/matches/check/${userId}`);
    } catch (error) {
      console.error('Check match error:', error);
      throw error;
    }
  }

  // Get match recommendations
  public static async getRecommendations(params?: {
    limit?: number;
    distance?: number;
  }): Promise<any[]> {
    try {
      return await apiClient.get('/matches/recommendations', { params });
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw error;
    }
  }
}

export default MatchService;
