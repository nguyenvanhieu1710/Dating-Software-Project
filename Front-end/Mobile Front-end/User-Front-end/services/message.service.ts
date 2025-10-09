import { httpService } from "./http.service";
import {
  IMessage,
  ApiResponse,
  PaginatedResponse,
  MessageQueryParams,
  CreateMessageRequest,
  UpdateMessageRequest,
  MessageWithSender,
  LastMessageResponse,
  UnreadCountResponse,
  MessageStatsResponse,
} from "@/types/message";
import { IMessageAttachment } from "@/types/message-attachment";
import { IMessageReaction } from "@/types/message-reaction";

// Extended types for better type safety
export type MessageDirection = "sent" | "received";

export interface MessageWithDirection extends IMessage {
  message_direction?: MessageDirection;
  first_name?: string;
  dob?: string;
  gender?: string;
}

export interface CreateAttachmentRequest {
  file_url: string;
  file_type: string;
  metadata?: any;
}

export interface CreateReactionRequest {
  reaction_type: string;
}

class MessageService {
  private readonly basePath = "/message";

  // ===== MESSAGE CRUD OPERATIONS =====

  /**
   * Get all messages (admin only)
   */
  async getAllMessages(
    params?: MessageQueryParams
  ): Promise<ApiResponse<PaginatedResponse<IMessage>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<IMessage>>>(
      `${this.basePath}${queryString ? `?${queryString}` : ""}`
    );
  }

  /**
   * Get message by ID
   */
  async getMessageById(messageId: number): Promise<ApiResponse<MessageWithDirection>> {
    return httpService.get<ApiResponse<MessageWithDirection>>(
      `${this.basePath}/${messageId}`
    );
  }

  /**
   * Create a new message
   */
  async createMessage(
    messageData: CreateMessageRequest
  ): Promise<ApiResponse<MessageWithSender>> {
    const errors = this.validateMessageData(messageData);
    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    return httpService.post<ApiResponse<MessageWithSender>>(
      this.basePath,
      messageData
    );
  }

  /**
   * Update a message
   */
  async updateMessage(
    messageId: number,
    messageData: UpdateMessageRequest
  ): Promise<ApiResponse<IMessage>> {
    return httpService.put<ApiResponse<IMessage>>(
      `${this.basePath}/${messageId}`,
      messageData
    );
  }

  /**
   * Delete a message (soft delete)
   */
  async deleteMessage(messageId: number): Promise<ApiResponse<void>> {
    return httpService.delete<ApiResponse<void>>(
      `${this.basePath}/${messageId}`
    );
  }

  // ===== MATCH-SPECIFIC OPERATIONS =====

  /**
   * Get all messages by match ID
   */
  async getMessagesByMatchId(
    matchId: number,
    params?: { limit?: number; offset?: number }
  ): Promise<ApiResponse<MessageWithDirection[]>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<MessageWithDirection[]>>(
      `${this.basePath}/match/${matchId}${queryString ? `?${queryString}` : ""}`
    );
  }

  /**
   * Mark all messages in a match as read
   */
  async markAllAsRead(matchId: number): Promise<ApiResponse<void>> {
    return httpService.put<ApiResponse<void>>(
      `${this.basePath}/match/${matchId}/read`,
      {}
    );
  }

  /**
   * Mark a single message as read
   */
  async markAsRead(messageId: number): Promise<ApiResponse<void>> {
    return httpService.put<ApiResponse<void>>(
      `${this.basePath}/${messageId}/read`,
      {}
    );
  }

  // ===== INBOX & NOTIFICATION OPERATIONS =====

  /**
   * Get last messages for all conversations (inbox list)
   */
  async getLastMessages(): Promise<ApiResponse<LastMessageResponse[]>> {
    return httpService.get<ApiResponse<LastMessageResponse[]>>(
      `${this.basePath}/last-messages`
    );
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(): Promise<ApiResponse<UnreadCountResponse>> {
    return httpService.get<ApiResponse<UnreadCountResponse>>(
      `${this.basePath}/unread-count`
    );
  }

  // ===== REACTION OPERATIONS =====

  /**
   * Add a reaction to a message
   */
  async addReaction(
    messageId: number,
    reactionData: CreateReactionRequest
  ): Promise<ApiResponse<IMessageReaction>> {
    const errors = this.validateReactionData(reactionData);
    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    return httpService.post<ApiResponse<IMessageReaction>>(
      `${this.basePath}/${messageId}/reactions`,
      reactionData
    );
  }

  /**
   * Remove a reaction from a message
   */
  async removeReaction(
    messageId: number,
    reactionId: number
  ): Promise<ApiResponse<void>> {
    return httpService.delete<ApiResponse<void>>(
      `${this.basePath}/${messageId}/reactions/${reactionId}`
    );
  }

  // ===== ATTACHMENT OPERATIONS =====

  /**
   * Add an attachment to a message
   */
  async addAttachment(
    messageId: number,
    attachmentData: CreateAttachmentRequest
  ): Promise<ApiResponse<IMessageAttachment>> {
    const errors = this.validateAttachmentData(attachmentData);
    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    return httpService.post<ApiResponse<IMessageAttachment>>(
      `${this.basePath}/${messageId}/attachments`,
      attachmentData
    );
  }

  /**
   * Remove an attachment from a message
   */
  async removeAttachment(
    messageId: number,
    attachmentId: number
  ): Promise<ApiResponse<void>> {
    return httpService.delete<ApiResponse<void>>(
      `${this.basePath}/${messageId}/attachments/${attachmentId}`
    );
  }

  // ===== VALIDATION METHODS =====

  /**
   * Validate message data before create/update
   */
  validateMessageData(
    messageData: CreateMessageRequest | UpdateMessageRequest
  ): string[] {
    const errors: string[] = [];

    if ("match_id" in messageData) {
      if (!messageData.match_id || messageData.match_id < 1) {
        errors.push("Valid match_id is required");
      }
    }

    if ("content" in messageData) {
      if (!messageData.content || messageData.content.trim().length === 0) {
        errors.push("Message content cannot be empty");
      }

      if (messageData.content && messageData.content.length > 5000) {
        errors.push("Message content must not exceed 5000 characters");
      }
    }

    if ("message_type" in messageData && messageData.message_type) {
      const validTypes = ["text", "image", "video", "audio", "file"];
      if (!validTypes.includes(messageData.message_type)) {
        errors.push(
          `Invalid message type. Must be one of: ${validTypes.join(", ")}`
        );
      }
    }

    return errors;
  }

  /**
   * Validate reaction data
   */
  validateReactionData(reactionData: CreateReactionRequest): string[] {
    const errors: string[] = [];

    if (!reactionData.reaction_type) {
      errors.push("Reaction type is required");
    }

    const validReactions = ["like", "love", "haha", "wow", "sad", "angry"];
    if (
      reactionData.reaction_type &&
      !validReactions.includes(reactionData.reaction_type)
    ) {
      errors.push(
        `Invalid reaction type. Must be one of: ${validReactions.join(", ")}`
      );
    }

    return errors;
  }

  /**
   * Validate attachment data
   */
  validateAttachmentData(attachmentData: CreateAttachmentRequest): string[] {
    const errors: string[] = [];

    if (!attachmentData.file_url) {
      errors.push("File URL is required");
    }

    if (attachmentData.file_url && !this.isValidUrl(attachmentData.file_url)) {
      errors.push("Invalid file URL format");
    }

    if (!attachmentData.file_type) {
      errors.push("File type is required");
    }

    const validFileTypes = ["image", "video", "audio", "document", "other"];
    if (
      attachmentData.file_type &&
      !validFileTypes.includes(attachmentData.file_type)
    ) {
      errors.push(
        `Invalid file type. Must be one of: ${validFileTypes.join(", ")}`
      );
    }

    return errors;
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate pagination params
   */
  validatePaginationParams(params: MessageQueryParams): string[] {
    const errors: string[] = [];

    if (params.limit !== undefined && (params.limit < 1 || params.limit > 100)) {
      errors.push("Limit must be between 1 and 100");
    }

    if (params.offset !== undefined && params.offset < 0) {
      errors.push("Offset must be greater than or equal to 0");
    }

    return errors;
  }

  // ===== UTILITY METHODS =====

  /**
   * Build query string from params object
   */
  private buildQueryString(params?: Record<string, any>): string {
    if (!params) return "";

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }

  /**
   * Format message for display
   */
  public formatMessageForDisplay(message: MessageWithDirection): MessageWithDirection & {
    time_formatted: string;
    is_edited: boolean;
    is_deleted: boolean;
    sender_display_name?: string;
  } {
    const timeFormatted = this.formatRelativeTime(new Date(message.sent_at));
    const isEdited = !!message.edited_at;
    const isDeleted = !!message.deleted_at;
    const senderDisplayName = message.first_name || "Unknown User";

    return {
      ...message,
      time_formatted: timeFormatted,
      is_edited: isEdited,
      is_deleted: isDeleted,
      sender_display_name: senderDisplayName,
    };
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7)} week${
        Math.floor(diffDays / 7) > 1 ? "s" : ""
      } ago`;

    return date.toLocaleDateString("en-US");
  }

  /**
   * Format message time for display (e.g., "10:30 AM")
   */
  public formatMessageTime(date: Date | string): string {
    const messageDate = typeof date === "string" ? new Date(date) : date;
    return messageDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Group messages by date
   */
  public groupMessagesByDate(
    messages: MessageWithDirection[]
  ): Record<string, MessageWithDirection[]> {
    return messages.reduce((groups, message) => {
      const date = new Date(message.sent_at).toLocaleDateString("en-US");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {} as Record<string, MessageWithDirection[]>);
  }

  /**
   * Check if message is from current user
   */
  public isOwnMessage(message: MessageWithDirection): boolean {
    return message.message_direction === "sent";
  }

  /**
   * Get message type icon/emoji
   */
  public getMessageTypeIcon(messageType: string): string {
    const icons: Record<string, string> = {
      text: "💬",
      image: "🖼️",
      video: "🎥",
      audio: "🎵",
      file: "📎",
    };
    return icons[messageType] || "📄";
  }

  /**
   * Truncate message content for preview
   */
  public truncateContent(content: string, maxLength: number = 50): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  }

  /**
   * Get file extension from URL
   */
  public getFileExtension(url: string): string {
    try {
      const pathname = new URL(url).pathname;
      const extension = pathname.split(".").pop();
      return extension ? extension.toLowerCase() : "";
    } catch {
      return "";
    }
  }

  /**
   * Format file size for display
   */
  public formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  /**
   * Check if message should show timestamp
   * (show timestamp if more than 5 minutes apart from previous message)
   */
  public shouldShowTimestamp(
    currentMessage: MessageWithDirection,
    previousMessage?: MessageWithDirection
  ): boolean {
    if (!previousMessage) return true;

    const currentTime = new Date(currentMessage.sent_at).getTime();
    const previousTime = new Date(previousMessage.sent_at).getTime();
    const timeDiff = currentTime - previousTime;

    return timeDiff > 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  /**
   * Check if messages should be grouped together
   * (same sender, within 2 minutes)
   */
  public shouldGroupMessages(
    currentMessage: MessageWithDirection,
    previousMessage?: MessageWithDirection
  ): boolean {
    if (!previousMessage) return false;

    const sameSender = currentMessage.sender_id === previousMessage.sender_id;
    const currentTime = new Date(currentMessage.sent_at).getTime();
    const previousTime = new Date(previousMessage.sent_at).getTime();
    const timeDiff = currentTime - previousTime;

    return sameSender && timeDiff < 2 * 60 * 1000; // 2 minutes
  }
}

// Export singleton instance
export const messageService = new MessageService();