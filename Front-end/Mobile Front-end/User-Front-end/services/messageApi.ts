import httpClient from './httpClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MessageType = 'text' | 'image' | 'video' | 'file' | 'audio';

export interface MessageData {
  id: number;
  match_id: number;
  sender_id: number;
  content: string;
  message_type: MessageType;
  sent_at: string;
  read_at: string | null;
  deleted_at: string | null;
  is_pinned?: boolean;
  pinned_at?: string | null;
  first_name: string;
  dob: string;
  gender: string;
  message_direction: 'sent' | 'received';
  sender?: {
    id: number;
    first_name: string;
    avatar_url?: string;
  };
}

export interface ConversationSummary {
  match_id: number;
  other_user_id: number;
  other_user_name: string;
  other_user_avatar?: string;
  last_message: {
    content: string;
    sent_at: string;
    is_read: boolean;
  };
  unread_count: number;
}

const getCurrentUserId = async (): Promise<number | null> => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      return null;
    }
    return parseInt(userId, 10);
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('auth_token');
  // console.log('Token from AsyncStorage:', token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Message API service
export const messageApi = {
  /**
   * Get messages for a specific match
   */
  getByMatchId: async (matchId: number, limit: number = 50, offset: number = 0): Promise<MessageData[]> => {
    try {
      // const auth = await getAuthHeaders();
      // console.log("auth: ", auth);
      const response = await httpClient.get(`/message/match/${matchId}`, {
        params: { limit, offset },
        headers: await getAuthHeaders()
      });
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching messages for match ${matchId}:`, error);
      throw error;
    }
  },

  /**
   * Send a new message
   */
  send: async (matchId: number, content: string, messageType: MessageType = 'text'): Promise<MessageData> => {
    try {
      const response = await httpClient.post(
        '/message/send',
        { match_id: matchId, content, message_type: messageType },
        { headers: await getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Mark a message as read
   */
  markAsRead: async (messageId: number): Promise<void> => {
    try {
      await httpClient.put(
        `/message/${messageId}/read`,
        {},
        { headers: await getAuthHeaders() }
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  /**
   * Mark all messages in a match as read
   */
  markAllAsRead: async (matchId: number): Promise<void> => {
    try {
      await httpClient.put(
        `/message/match/${matchId}/read`,
        {},
        { headers: await getAuthHeaders() }
      );
    } catch (error) {
      console.error('Error marking all messages as read:', error);
      throw error;
    }
  },

  /**
   * Get last messages from all conversations
   */
  getLastMessages: async (): Promise<ConversationSummary[]> => {
    try {
      const response = await httpClient.get('/message/last-messages', {
        headers: await getAuthHeaders()
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching last messages:', error);
      throw error;
    }
  },

  /**
   * Get unread message counts
   */
  getUnreadCounts: async (): Promise<{match_id: number, unread_count: number}[]> => {
    try {
      const response = await httpClient.get('/message/unread-count', {
        headers: await getAuthHeaders()
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching unread counts:', error);
      throw error;
    }
  },

  /**
   * Delete a message
   */
  delete: async (messageId: number): Promise<void> => {
    try {
      await httpClient.delete(`/message/${messageId}`, {
        headers: await getAuthHeaders()
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  /**
   * Search messages in a match
   */
  search: async (matchId: number, query: string): Promise<MessageData[]> => {
    try {
      const response = await httpClient.get(`/message/match/${matchId}/search`, {
        params: { q: query },
        headers: await getAuthHeaders()
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }
};

export default messageApi;

// Get unread message count for current user
export const getUnreadMessageCount = async (): Promise<number> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return 0;
    }

    // This would need a specific backend endpoint for unread count
    // For now, we'll return 0 as placeholder
    return 0;
  } catch (error) {
    console.error('Error fetching unread message count:', error);
    return 0;
  }
};

// Search messages in a conversation
export const searchMessages = async (matchId: number, keyword: string): Promise<MessageData[]> => {
  try {
    // This would need a search endpoint in the backend
    // For now, we'll return empty array
    return [];
  } catch (error) {
    console.error('Error searching messages:', error);
    return [];
  }
};

// Delete a message (soft delete)
export const deleteMessage = async (messageId: number): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    // This would need a delete message endpoint
    // For now, return false as not implemented
    return false;
  } catch (error) {
    console.error('Error deleting message:', error);
    return false;
  }
};
