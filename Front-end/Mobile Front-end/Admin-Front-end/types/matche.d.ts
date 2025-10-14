export interface IMatch {
  id: number;
  user1_id: number;
  user2_id: number;
  status: string;
  created_at: string;
  last_message_at: string;
  last_message_preview: string;
}

export interface MatchStats {
  total_matches: number;
  matches_this_week: number;
  matches_this_month: number;
}

export interface MutualMatchResult {
  isMutual: boolean;
  user1LikedUser2: boolean;
  user2LikedUser1: boolean;
}

export interface CreateMatchRequest {
  user1_id: number;
  user2_id: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
