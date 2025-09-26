// src/entities/setting.js
/**
 * @typedef {Object} Setting
 * @property {number} user_id
 * @property {string} [preferred_gender] - "male" | "female" | "other" | null
 * @property {number} min_age
 * @property {number} max_age
 * @property {number} max_distance_km
 * @property {string[]} show_me - ("male" | "female" | "other")[]
 * @property {boolean} is_discoverable
 * @property {boolean} hide_age
 * @property {boolean} hide_distance
 * @property {boolean} show_last_active
 * @property {boolean} show_online_status
 * @property {boolean} block_messages_from_strangers
 * @property {boolean} new_matches_notification
 * @property {boolean} new_messages_notification
 * @property {boolean} message_likes_notification
 * @property {boolean} message_super_likes_notification
 * @property {boolean} profile_views_notification
 * @property {boolean} email_notifications
 * @property {boolean} push_notifications
 * @property {boolean} promotional_emails
 * @property {string} language - "en" | "vi" | "ja" | "ko" | "zh"
 * @property {string} theme - "light" | "dark" | "system"
 * @property {string} account_type - "free" | "premium" | "gold"
 * @property {string} verification_status - "pending" | "verified" | "rejected"
 * @property {Object} preferences - Record<string, any>
 * @property {string} created_at
 * @property {string} updated_at
 */
module.exports = {};