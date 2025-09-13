import { apiClient } from './apiClient';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  type: 'text' | 'image' | 'location';
  metadata?: any;
}

export interface Chat {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    photo?: string;
    lastSeen?: string;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

class MessageService {
  // Get all chats for current user
  public static async getChats(params?: {
    page?: number;
    limit?: number;
  }): Promise<{ data: Chat[]; total: number }> {
    try {
      return await apiClient.get('/chats', { params });
    } catch (error) {
      console.error('Get chats error:', error);
      throw error;
    }
  }

  // Get messages in a chat
  public static async getMessages(
    chatId: string,
    params?: {
      before?: string;
      limit?: number;
    }
  ): Promise<{ data: Message[]; hasMore: boolean }> {
    try {
      return await apiClient.get(`/chats/${chatId}/messages`, { params });
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }

  // Send a text message
  public static async sendTextMessage(
    chatId: string,
    content: string
  ): Promise<Message> {
    try {
      return await apiClient.post(`/chats/${chatId}/messages`, {
        type: 'text',
        content,
      });
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  // Send an image message
  public static async sendImageMessage(
    chatId: string,
    image: any
  ): Promise<Message> {
    try {
      const response = await apiClient.upload<{ url: string }>('/messages/image', image, 'image');
      return await apiClient.post<Message>(`/chats/${chatId}/messages`, {
        type: 'image',
        content: response.url,
      });
    } catch (error) {
      console.error('Send image message error:', error);
      throw error;
    }
  }

  // Mark messages as read
  public static async markAsRead(chatId: string, messageIds: string[]): Promise<void> {
    try {
      await apiClient.put(`/chats/${chatId}/read`, { messageIds });
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  // Delete a message
  public static async deleteMessage(chatId: string, messageId: string): Promise<void> {
    try {
      await apiClient.delete(`/chats/${chatId}/messages/${messageId}`);
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  }

  // Get or create a chat with a user
  public static async getOrCreateChat(userId: string): Promise<Chat> {
    try {
      return await apiClient.post('/chats', { participantId: userId });
    } catch (error) {
      console.error('Get or create chat error:', error);
      throw error;
    }
  }
}

export default MessageService;
