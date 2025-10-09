/**
 * Core Message Interface
 * Represents a message in the chat system
 */
export interface IMessage {
  id: number;
  match_id: number;
  sender_id: number;
  content: string;
  message_type: "text" | "image" | "video" | "audio" | "file";
  sent_at: string;
  read_at: string | null;
  deleted_at: string | null;
  is_pinned: boolean;
  pinned_at: string | null;
  reply_to_message_id: number | null;
  edited_at: string | null;
}

/**
 * Message with sender information
 */
export interface MessageWithSender extends IMessage {
  sender: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

/**
 * Message with direction (sent/received)
 */
export interface MessageWithDirection extends IMessage {
  message_direction?: "sent" | "received";
  first_name?: string;
  dob?: string;
  gender?: string;
}

/**
 * Message with full profile information
 */
export interface MessageWithProfile extends IMessage {
  sender_profile: {
    id: number;
    first_name: string;
    dob: string;
    gender: string;
    avatar?: string;
  };
}

/**
 * Formatted message for display purposes
 */
export interface FormattedMessage extends MessageWithDirection {
  time_formatted: string;
  is_edited: boolean;
  is_deleted: boolean;
  sender_display_name?: string;
  show_timestamp?: boolean;
  should_group?: boolean;
}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ===== QUERY PARAMETER TYPES =====

export interface MessageQueryParams {
  limit?: number;
  offset?: number;
  match_id?: number;
  sender_id?: number;
  message_type?: "text" | "image" | "video" | "audio" | "file";
  start_date?: string;
  end_date?: string;
  search?: string;
  is_pinned?: boolean;
  is_deleted?: boolean;
}

export interface MessagePaginationParams {
  limit?: number;
  offset?: number;
  before_id?: number;
  after_id?: number;
}

export interface InfiniteScrollParams {
  match_id: number;
  limit?: number;
  cursor?: string;
  direction?: "before" | "after";
}

// ===== REQUEST TYPES =====

export interface CreateMessageRequest {
  match_id: number;
  content: string;
  message_type?: "text" | "image" | "video" | "audio" | "file";
  reply_to_message_id?: number;
}

export interface UpdateMessageRequest {
  content?: string;
  message_type?: "text" | "image" | "video" | "audio" | "file";
  is_pinned?: boolean;
}

// ===== RESPONSE TYPES =====

export interface LastMessageResponse extends IMessage {
  match_id: number;
  user1_id: number;
  user2_id: number;
  other_user_id: number;
  other_user_name: string;
  other_user_dob: string;
  other_user_gender: string;
  other_user_avatar?: string;
  first_name?: string;
  dob?: string;
  gender?: string;
}

export interface UnreadCountResponse {
  match_id: number;
  unread_count: number;
  last_message_time: string;
}

export interface MessageStatsResponse {
  total_messages: number;
  sent_messages: number;
  received_messages: number;
  unread_messages: number;
  active_conversations: number;
  last_message_time: string;
  recent_activity: RecentActivityItem[];
}

export interface RecentActivityItem {
  date: string;
  message_count: number;
}

// ===== EXTENDED MESSAGE TYPES =====

export interface MessageWithDetails extends IMessage {
  sender: {
    id: number;
    name: string;
    avatar: string | null;
  };
  attachments?: IMessageAttachment[];
  reactions?: MessageReactionSummary[];
  reply_to?: IMessage;
}

// ===== CONVERSATION TYPES =====

export interface Conversation {
  match_id: number;
  other_user: {
    id: number;
    name: string;
    avatar: string | null;
    dob?: string;
    gender?: string;
    last_active_at?: string;
  };
  last_message: {
    id: number;
    content: string;
    message_type: "text" | "image" | "video" | "audio" | "file";
    sent_at: string;
    is_read: boolean;
    sender_id: number;
  };
  unread_count: number;
  is_pinned?: boolean;
  is_archived?: boolean;
}

// ===== MESSAGE GROUPING TYPES =====

export interface MessageGroup {
  date: string;
  messages: MessageWithDirection[];
}

export interface MessageBubbleGroup {
  sender_id: number;
  messages: MessageWithDirection[];
  show_avatar: boolean;
  show_name: boolean;
}

// ===== REAL-TIME TYPES =====

export interface TypingIndicator {
  match_id: number;
  user_id: number;
  user_name: string;
  is_typing: boolean;
  timestamp: string;
}

export interface MessageDeliveryStatus {
  message_id: number;
  status: "sent" | "delivered" | "read" | "failed";
  delivered_at?: string;
  read_at?: string;
}

// ===== WEBSOCKET EVENT TYPES =====

export interface WebSocketMessage {
  type: "message" | "typing" | "read" | "reaction" | "delete";
  data: any;
  timestamp: string;
}

export interface NewMessageEvent {
  type: "message";
  data: MessageWithSender;
}

export interface TypingEvent {
  type: "typing";
  data: TypingIndicator;
}

export interface ReadEvent {
  type: "read";
  data: {
    match_id: number;
    message_id: number;
    user_id: number;
    read_at: string;
  };
}

export interface DeleteEvent {
  type: "delete";
  data: {
    message_id: number;
    deleted_at: string;
  };
}

// ===== SEARCH & FILTER TYPES =====

export interface MessageSearchParams {
  match_id: number;
  keyword: string;
  message_type?: "text" | "image" | "video" | "audio" | "file";
  start_date?: string;
  end_date?: string;
}

export interface MessageDateRangeParams {
  match_id: number;
  start_date: string;
  end_date: string;
}

export interface MediaMessageParams {
  match_id: number;
  media_type?: "image" | "video" | "audio" | "file";
}

export interface MessageFilterOptions {
  message_types?: ("text" | "image" | "video" | "audio" | "file")[];
  has_attachments?: boolean;
  has_reactions?: boolean;
  is_pinned?: boolean;
  is_edited?: boolean;
  sender_id?: number;
  date_range?: {
    start: string;
    end: string;
  };
}

// ===== SORT TYPES =====

export type MessageSortField = "sent_at" | "read_at" | "edited_at";
export type SortOrder = "asc" | "desc";

export interface MessageSortOptions {
  field: MessageSortField;
  order: SortOrder;
}

// ===== BULK OPERATION TYPES =====

export interface BulkDeleteRequest {
  message_ids: number[];
}

export interface BulkMarkAsReadRequest {
  message_ids: number[];
}

export interface BulkOperationResponse {
  success: boolean;
  processed: number;
  failed: number;
  errors?: MessageError[];
}

// ===== ERROR TYPES =====

export interface MessageError {
  code: string;
  message: string;
  field?: string;
}

export interface MessageValidationError {
  errors: MessageError[];
}

// ===== EXPORT TYPES =====

export interface ExportMessagesParams {
  match_id: number;
  format: "json" | "csv" | "txt";
  start_date?: string;
  end_date?: string;
  include_attachments?: boolean;
}

// ===== UTILITY TYPES =====

export type MessageType = "text" | "image" | "video" | "audio" | "file";
export type MessageStatus = "sent" | "delivered" | "read" | "failed";
export type MessageDirection = "sent" | "received";
export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry";
export type AttachmentType = "image" | "video" | "audio" | "document" | "other";