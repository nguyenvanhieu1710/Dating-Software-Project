import { httpService } from './http.service';
import { IMessage } from '@/types/message';
import { IMessageAttachment } from '@/types/message-attachment';
import { IMessageReaction } from '@/types/message-reaction';

// Response types for API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Query parameters for messages
export interface MessageQueryParams {
  matchId?: number;
  limit?: number;
  offset?: number;
  message_type?: 'text' | 'image' | 'video' | 'audio' | 'file';
  sort_by?: 'id' | 'sent_at' | 'read_at';
  sort_order?: 'asc' | 'desc';
}

// Create message request
export interface CreateMessageRequest {
  match_id: number;
  content: string;
  message_type?: 'text' | 'image' | 'video' | 'audio' | 'file';
  reply_to_message_id?: number;
}

// Update message request
export interface UpdateMessageRequest {
  content?: string;
  message_type?: 'text' | 'image' | 'video' | 'audio' | 'file';
}

// Message with sender info
export interface MessageWithSender extends IMessage {
  first_name?: string;
  dob?: string;
  gender?: string;
  message_direction?: 'sent' | 'received';
}

// Last message for inbox
export interface LastMessage extends IMessage {
  match_id: number;
  user1_id: number;
  user2_id: number;
  other_user_id: number;
  other_user_name?: string;
  other_user_dob?: string;
  other_user_gender?: string;
}

// Unread count
export interface UnreadCount {
  match_id: number;
  unread_count: number;
  last_message_time: string;
}

// Message stats
export interface MessageStats {
  total_messages: number;
  sent_messages: number;
  received_messages: number;
  unread_messages: number;
  active_conversations: number;
  last_message_time: string;
  recent_activity: Array<{
    date: string;
    message_count: number;
  }>;
}

// Reaction summary
export interface ReactionSummary {
  reaction_type: string;
  count: number;
  users: number[];
}

// Add reaction request
export interface AddReactionRequest {
  reaction_type: string;
}

// Add attachment request
export interface AddAttachmentRequest {
  file_url: string;
  file_type: string;
  metadata?: any;
}

class AdminMessageService {
  private readonly basePath = '/message';

  // ===== BASIC CRUD OPERATIONS =====

  /**
   * Lấy tất cả messages với filter
   */
  async getAllMessages(params?: MessageQueryParams): Promise<ApiResponse<MessageWithSender[]>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<MessageWithSender[]>>(
      `${this.basePath}${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Lấy message theo ID
   */
  async getMessageById(messageId: number): Promise<ApiResponse<MessageWithSender>> {
    return httpService.get<ApiResponse<MessageWithSender>>(`${this.basePath}/${messageId}`);
  }

  /**
   * Tạo message mới (gửi tin nhắn)
   */
  async createMessage(messageData: CreateMessageRequest): Promise<ApiResponse<MessageWithSender>> {
    return httpService.post<ApiResponse<MessageWithSender>>(this.basePath, messageData);
  }

  /**
   * Cập nhật message
   */
  async updateMessage(messageId: number, messageData: UpdateMessageRequest): Promise<ApiResponse<MessageWithSender>> {
    return httpService.put<ApiResponse<MessageWithSender>>(`${this.basePath}/${messageId}`, messageData);
  }

  /**
   * Xóa message
   */
  async deleteMessage(messageId: number): Promise<ApiResponse<null>> {
    return httpService.delete<ApiResponse<null>>(`${this.basePath}/${messageId}`);
  }

  // ===== MESSAGE QUERIES =====

  /**
   * Lấy messages theo match ID
   */
  async getMessagesByMatchId(matchId: number, limit: number = 50, offset: number = 0): Promise<ApiResponse<MessageWithSender[]>> {
    return httpService.get<ApiResponse<MessageWithSender[]>>(
      `${this.basePath}/match/${matchId}?limit=${limit}&offset=${offset}`
    );
  }

  /**
   * Lấy tin nhắn cuối cùng của mỗi cuộc trò chuyện (inbox list)
   */
  async getLastMessages(): Promise<ApiResponse<LastMessage[]>> {
    return httpService.get<ApiResponse<LastMessage[]>>(`${this.basePath}/last-messages`);
  }

  /**
   * Đếm số tin chưa đọc
   */
  async getUnreadCount(): Promise<ApiResponse<UnreadCount[]>> {
    return httpService.get<ApiResponse<UnreadCount[]>>(`${this.basePath}/unread-count`);
  }

  // ===== MESSAGE ACTIONS =====

  /**
   * Đánh dấu 1 tin nhắn đã đọc
   */
  async markAsRead(messageId: number): Promise<ApiResponse<IMessage>> {
    return httpService.put<ApiResponse<IMessage>>(`${this.basePath}/${messageId}/read`, {});
  }

  /**
   * Đánh dấu tất cả tin nhắn trong match đã đọc
   */
  async markAllAsRead(matchId: number): Promise<ApiResponse<null>> {
    return httpService.put<ApiResponse<null>>(`${this.basePath}/match/${matchId}/read`, {});
  }

  // ===== REACTIONS API =====

  /**
   * Thêm reaction vào tin nhắn
   */
  async addReaction(messageId: number, reactionData: AddReactionRequest): Promise<ApiResponse<IMessageReaction>> {
    return httpService.post<ApiResponse<IMessageReaction>>(
      `${this.basePath}/${messageId}/reactions`,
      reactionData
    );
  }

  /**
   * Xóa reaction khỏi tin nhắn
   */
  async removeReaction(messageId: number, reactionId: number): Promise<ApiResponse<null>> {
    return httpService.delete<ApiResponse<null>>(
      `${this.basePath}/${messageId}/reactions/${reactionId}`
    );
  }

  // ===== ATTACHMENTS API =====

  /**
   * Thêm attachment vào tin nhắn
   */
  async addAttachment(messageId: number, attachmentData: AddAttachmentRequest): Promise<ApiResponse<IMessageAttachment>> {
    return httpService.post<ApiResponse<IMessageAttachment>>(
      `${this.basePath}/${messageId}/attachments`,
      attachmentData
    );
  }

  /**
   * Xóa attachment khỏi tin nhắn
   */
  async removeAttachment(messageId: number, attachmentId: number): Promise<ApiResponse<null>> {
    return httpService.delete<ApiResponse<null>>(
      `${this.basePath}/${messageId}/attachments/${attachmentId}`
    );
  }

  // ===== UTILITY METHODS =====

  /**
   * Build query string từ params object
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
   * Validate message data before create/update
   */
  public validateMessageData(messageData: CreateMessageRequest | UpdateMessageRequest): string[] {
    const errors: string[] = [];

    if ('match_id' in messageData) {
      if (!messageData.match_id || messageData.match_id <= 0) {
        errors.push('Match ID không hợp lệ');
      }
    }

    if ('content' in messageData) {
      if (!messageData.content || messageData.content.trim() === '') {
        errors.push('Nội dung tin nhắn không được để trống');
      }
      if (messageData.content && messageData.content.length > 5000) {
        errors.push('Nội dung tin nhắn không được vượt quá 5000 ký tự');
      }
    }

    if ('message_type' in messageData && messageData.message_type) {
      const validTypes = ['text', 'image', 'video', 'audio', 'file'];
      if (!validTypes.includes(messageData.message_type)) {
        errors.push('Loại tin nhắn không hợp lệ');
      }
    }

    return errors;
  }

  /**
   * Format message data for display
   */
  public formatMessageForDisplay(message: IMessage): IMessage & {
    sent_at_formatted?: string;
    read_at_formatted?: string;
    is_read: boolean;
    is_deleted: boolean;
    time_ago: string;
  } {
    const sentAtFormatted = message.sent_at
      ? this.formatDateTime(new Date(message.sent_at))
      : undefined;

    const readAtFormatted = message.read_at
      ? this.formatDateTime(new Date(message.read_at))
      : undefined;

    const timeAgo = message.sent_at
      ? this.formatRelativeTime(new Date(message.sent_at))
      : '';

    return {
      ...message,
      sent_at_formatted: sentAtFormatted,
      read_at_formatted: readAtFormatted,
      is_read: !!message.read_at,
      is_deleted: !!message.deleted_at,
      time_ago: timeAgo,
    };
  }

  /**
   * Format date time
   */
  private formatDateTime(date: Date): string {
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Format relative time (e.g., "2 giờ trước")
   */
  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  }

  /**
   * Get message type display name
   */
  public getMessageTypeDisplayName(type: string): string {
    const typeMap: Record<string, string> = {
      text: 'Văn bản',
      image: 'Hình ảnh',
      video: 'Video',
      audio: 'Âm thanh',
      file: 'Tệp đính kèm',
    };
    return typeMap[type] || type;
  }

  /**
   * Get message type icon
   */
  public getMessageTypeIcon(type: string): string {
    const iconMap: Record<string, string> = {
      text: 'chatbubble-outline',
      image: 'image-outline',
      video: 'videocam-outline',
      audio: 'musical-notes-outline',
      file: 'document-outline',
    };
    return iconMap[type] || 'help-outline';
  }

  /**
   * Get message type color
   */
  public getMessageTypeColor(type: string): string {
    const colorMap: Record<string, string> = {
      text: '#2196F3',
      image: '#4CAF50',
      video: '#FF9800',
      audio: '#9C27B0',
      file: '#607D8B',
    };
    return colorMap[type] || '#9E9E9E';
  }

  /**
   * Group messages by date
   */
  public groupMessagesByDate(messages: IMessage[]): Record<string, IMessage[]> {
    return messages.reduce((groups, message) => {
      const date = new Date(message.sent_at).toLocaleDateString('vi-VN');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {} as Record<string, IMessage[]>);
  }

  /**
   * Filter unread messages
   */
  public filterUnreadMessages(messages: IMessage[]): IMessage[] {
    return messages.filter(message => !message.read_at);
  }

  /**
   * Filter messages by type
   */
  public filterMessagesByType(messages: IMessage[], type: string): IMessage[] {
    return messages.filter(message => message.message_type === type);
  }

  /**
   * Get total unread count from unread counts array
   */
  public getTotalUnreadCount(unreadCounts: UnreadCount[]): number {
    return unreadCounts.reduce((total, item) => total + item.unread_count, 0);
  }

  /**
   * Sort messages by sent_at
   */
  public sortMessagesBySentAt(messages: IMessage[], order: 'asc' | 'desc' = 'asc'): IMessage[] {
    return [...messages].sort((a, b) => {
      const dateA = new Date(a.sent_at).getTime();
      const dateB = new Date(b.sent_at).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Check if message is from current user
   */
  public isMessageFromCurrentUser(message: MessageWithSender): boolean {
    return message.message_direction === 'sent';
  }

  /**
   * Get conversation summary
   */
  public getConversationSummary(messages: IMessage[]): {
    totalMessages: number;
    unreadMessages: number;
    lastMessageTime?: string;
    messageTypes: Record<string, number>;
  } {
    const totalMessages = messages.length;
    const unreadMessages = messages.filter(m => !m.read_at).length;
    const lastMessageTime = messages.length > 0 
      ? messages[messages.length - 1].sent_at 
      : undefined;

    const messageTypes = messages.reduce((acc, message) => {
      const messageType = message.message_type || 'unknown';
      acc[messageType] = (acc[messageType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMessages,
      unreadMessages,
      lastMessageTime,
      messageTypes,
    };
  }

  /**
   * Search messages by content
   */
  public searchMessages(messages: IMessage[], keyword: string): IMessage[] {
    const lowerKeyword = keyword.toLowerCase();
    return messages.filter(message => 
      message.content.toLowerCase().includes(lowerKeyword)
    );
  }
}

// Export singleton instance
export const adminMessageService = new AdminMessageService();