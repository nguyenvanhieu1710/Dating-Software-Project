export interface IMatch extends IMatchWithUser{
  id: number;
  user1_id: number;
  user2_id: number;
  status: string;
  created_at: string;
  last_message_at: string;
  last_message_preview: string;
}

export interface IMatchWithUser {
  other_user_id: number;
  first_name: string;
  dob: string;
  gender: string;
  bio: string;
  job_title: string;
  school: string;
  photo_url: string;
  message_count: number;
  last_message_preview?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface MatchQueryParams {
  page?: number;
  limit?: number;
  status?: string;
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
