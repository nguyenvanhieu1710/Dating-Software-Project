export interface ISetting {
  user_id: number;

  // Discovery preferences
  preferred_gender?: "male" | "female" | "other" | null;
  min_age: number;
  max_age: number;
  max_distance_km: number;
  show_me: ("male" | "female" | "other")[];

  // Privacy settings
  is_discoverable: boolean;
  hide_age: boolean;
  hide_distance: boolean;
  show_last_active: boolean;
  show_online_status: boolean;
  block_messages_from_strangers: boolean;

  // Notification settings
  new_matches_notification: boolean;
  new_messages_notification: boolean;
  message_likes_notification: boolean;
  message_super_likes_notification: boolean;
  profile_views_notification: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  promotional_emails: boolean;

  // Account settings
  language: "en" | "vi" | "ja" | "ko" | "zh";
  theme: "light" | "dark" | "system";
  account_type: "free" | "premium" | "gold";
  verification_status: "pending" | "verified" | "rejected";

  // Additional flexible settings
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Response types for API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Query parameters for settings
export interface SettingQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  user_id?: number;
  language?: string;
  theme?: string;
  account_type?: string;
  verification_status?: string;
  sort_by?: "user_id" | "created_at" | "updated_at";
  sort_order?: "asc" | "desc";
}

// Create/Update request types
export interface CreateSettingRequest {
  user_id: number;
  preferred_gender?: "male" | "female" | "other" | null;
  min_age?: number;
  max_age?: number;
  max_distance_km?: number;
  show_me?: ("male" | "female" | "other")[];
  is_discoverable?: boolean;
  hide_age?: boolean;
  hide_distance?: boolean;
  show_last_active?: boolean;
  show_online_status?: boolean;
  block_messages_from_strangers?: boolean;
  new_matches_notification?: boolean;
  new_messages_notification?: boolean;
  message_likes_notification?: boolean;
  message_super_likes_notification?: boolean;
  profile_views_notification?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  promotional_emails?: boolean;
  language?: "en" | "vi" | "ja" | "ko" | "zh";
  theme?: "light" | "dark" | "system";
  account_type?: "free" | "premium" | "gold";
  verification_status?: "pending" | "verified" | "rejected";
  preferences?: Record<string, any>;
}

export interface UpdateSettingRequest {
  preferred_gender?: "male" | "female" | "other" | null;
  min_age?: number;
  max_age?: number;
  max_distance_km?: number;
  show_me?: ("male" | "female" | "other")[];
  is_discoverable?: boolean;
  hide_age?: boolean;
  hide_distance?: boolean;
  show_last_active?: boolean;
  show_online_status?: boolean;
  block_messages_from_strangers?: boolean;
  new_matches_notification?: boolean;
  new_messages_notification?: boolean;
  message_likes_notification?: boolean;
  message_super_likes_notification?: boolean;
  profile_views_notification?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  promotional_emails?: boolean;
  language?: "en" | "vi" | "ja" | "ko" | "zh";
  theme?: "light" | "dark" | "system";
  account_type?: "free" | "premium" | "gold";
  verification_status?: "pending" | "verified" | "rejected";
  preferences?: Record<string, any>;
}

export interface UpdateNotificationsRequest {
  new_matches_notification?: boolean;
  new_messages_notification?: boolean;
  message_likes_notification?: boolean;
  message_super_likes_notification?: boolean;
  profile_views_notification?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  promotional_emails?: boolean;
}

export interface UpdateLanguageRequest {
  language: "en" | "vi" | "ja" | "ko" | "zh";
}

export interface UpdateThemeRequest {
  theme: "light" | "dark" | "system";
}

// Statistics response type
export interface SettingStats {
  total_settings: number;
  language_counts: Record<string, number>;
  theme_counts: Record<string, number>;
  account_type_counts: Record<string, number>;
  verification_status_counts: Record<string, number>;
}
