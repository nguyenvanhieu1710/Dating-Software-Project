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
