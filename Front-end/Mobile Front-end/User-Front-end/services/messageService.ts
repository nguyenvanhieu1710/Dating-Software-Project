import messageApi, { MessageData as Message, ConversationSummary, MessageType } from './messageApi';
import { apiClient } from './apiClient';

// Re-export types for external use
export type { Message, MessageType };

export interface Chat {
  id: string;
  matchId: number;
  otherUserId: number;
  participants: Array<{
    id: number;
    name: string;
    avatar?: string;
    lastSeen?: string;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  // Keep ConversationSummary fields for backward compatibility
  last_message?: {
    content: string;
    sent_at: string;
    is_read: boolean;
  };
  unread_count?: number;
}

class MessageService {
  // Get all chats for current user
  public static async getChats(params?: {
    page?: number;
    limit?: number;
  }): Promise<{ data: Chat[]; total: number }> {
    try {
      const conversations = await messageApi.getLastMessages();
      
      const chats: Chat[] = conversations.map(conv => {
        const chat: Chat = {
          id: `match_${conv.match_id}`,
          matchId: conv.match_id,
          otherUserId: conv.other_user_id,
          participants: [
            {
              id: conv.other_user_id,
              name: conv.other_user_name,
              avatar: conv.other_user_avatar
            }
          ],
          lastMessage: undefined,
          unreadCount: conv.unread_count,
          last_message: conv.last_message,
          unread_count: conv.unread_count,
          createdAt: conv.last_message?.sent_at || new Date().toISOString(),
          updatedAt: conv.last_message?.sent_at || new Date().toISOString()
        };

        // Add last message if it exists
        if (conv.last_message) {
          chat.lastMessage = {
            id: conv.match_id, // Use numeric ID to match MessageData interface
            content: conv.last_message.content,
            sent_at: conv.last_message.sent_at,
            message_type: 'text',
            message_direction: 'received',
            sender_id: conv.other_user_id,
            match_id: conv.match_id,
            deleted_at: null,
            read_at: conv.last_message.is_read ? conv.last_message.sent_at : null,
            first_name: conv.other_user_name,
            dob: '',
            gender: ''
          };
        }

        return chat;
      });

      return {
        data: chats,
        total: chats.length
      };
    } catch (error) {
      console.error('Get chats error:', error);
      throw error;
    }
  }

  // Get messages in a chat
  public static async getMessages(
    matchId: string | number,
    params?: {
      before?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ data: Message[]; hasMore: boolean }> {
    try {
      const id = typeof matchId === 'string' ? parseInt(matchId.replace('match_', ''), 10) : matchId;
      // console.log("id: ", id);
      const messages = await messageApi.getByMatchId(id, params?.limit || 50, params?.offset || 0);
      // console.log("messages of getMessages: ", messages);
      
      return {
        data: messages,
        hasMore: messages.length === (params?.limit || 50)
      };
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }

  // Send a text message
  public static async sendTextMessage(
    matchId: string | number,
    content: string
  ): Promise<Message> {
    try {
      const id = typeof matchId === 'string' ? parseInt(matchId.replace('match_', ''), 10) : matchId;
      console.log("id: ", id);
      console.log("content: ", content);
            
      return await messageApi.send(id, content, 'text');
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  // Send an image message
  public static async sendImageMessage(
    matchId: string | number,
    image: any
  ): Promise<Message> {
    try {
      const id = typeof matchId === 'string' ? parseInt(matchId.replace('match_', ''), 10) : matchId;
      const response = await apiClient.upload<{ url: string }>('/messages/upload', image, 'image');
      return await messageApi.send(id, response.url, 'image');
    } catch (error) {
      console.error('Send image message error:', error);
      throw error;
    }
  }

  // Mark messages as read
  public static async markAsRead(matchId: string | number, messageIds: number[]): Promise<void> {
    try {
      const id = typeof matchId === 'string' ? parseInt(matchId.replace('match_', ''), 10) : matchId;
      await messageApi.markAllAsRead(id);
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  // Delete a message
  public static async deleteMessage(messageId: number): Promise<void> {
    try {
      await messageApi.delete(messageId);
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  }

  // Get or create a chat with a user
  public static async getOrCreateChat(userId: string): Promise<Chat> {
    try {
      // This would typically call a different endpoint to create a match/chat
      // For now, we'll just return a chat with the user
      const response = await apiClient.post<{
        id: number;
        other_user_id: number;
        other_user_name: string;
        other_user_avatar?: string;
      }>('/matches/create', { userId });
      
      return {
        id: `match_${response.id}`,
        matchId: response.id,
        otherUserId: response.other_user_id,
        participants: [
          {
            id: response.other_user_id,
            name: response.other_user_name,
            avatar: response.other_user_avatar
          }
        ],
        lastMessage: undefined,
        unreadCount: 0,
        last_message: undefined,
        unread_count: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Get or create chat error:', error);
      throw error;
    }
  }

  // Get unread message count
  public static async getUnreadCount(): Promise<number> {
    try {
      const response = await messageApi.getUnreadCounts();
      return response.reduce((total, item) => total + item.unread_count, 0);
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }
}

export default MessageService;
