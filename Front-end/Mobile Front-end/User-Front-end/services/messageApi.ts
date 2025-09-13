import httpClient from './httpClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Message interface matching backend response
export interface MessageData {
  id: number;
  match_id: number;
  sender_id: number;
  content: string;
  message_type: string;
  sent_at: string;
  read_at: string | null;
  deleted_at: string | null;
  is_pinned?: boolean;
  pinned_at?: string | null;
  first_name: string;
  dob: string;
  gender: string;
  message_direction: 'sent' | 'received';
}

// Conversation summary interface
export interface ConversationSummary {
  match_id: number;
  other_user_id: number;
  other_user_name: string;
  other_user_dob: string;
  other_user_gender: string;
  last_message: MessageData;
  unread_count?: number;
}

// Helper function to get current user ID
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

// Get messages for a specific match
export const getMessagesByMatchId = async (
  matchId: number, 
  limit: number = 50, 
  offset: number = 0
): Promise<MessageData[]> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    const response = await httpClient.get(`/match/${matchId}/by-user/${userId}/messages`, {
      params: { limit, offset }
    });
    
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.warn('Unexpected messages response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching messages for match ${matchId}:`, error);
    return [];
  }
};

// Send a new message
export const sendMessage = async (matchId: number, content: string): Promise<MessageData | null> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    const response = await httpClient.post(`/match/${matchId}/by-user/${userId}/messages`, {
      content
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (matchId: number): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    const response = await httpClient.put(`/match/${matchId}/by-user/${userId}/messages/read`);
    
    return response.data.success;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return false;
  }
};

// Get last messages for all conversations (for messages list screen)
export const getLastMessages = async (): Promise<ConversationSummary[]> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    // This would use the getLastMessagesByUserId method from backend
    // For now, we'll get matches and their last messages through the match API
    const response = await httpClient.get(`/match/by-user/${userId}`);
    
    if (response.data.success && Array.isArray(response.data.data)) {
      // Filter matches that have messages and convert to conversation summaries
      const conversations: ConversationSummary[] = response.data.data
        .filter((match: any) => match.message_count > 0)
        .map((match: any) => ({
          match_id: match.id,
          other_user_id: match.other_user_id,
          other_user_name: match.first_name,
          other_user_dob: match.dob,
          other_user_gender: match.gender,
          last_message: {
            id: 0, // We don't have the actual last message details here
            match_id: match.id,
            sender_id: 0,
            content: 'Tap to view conversation', // Placeholder
            message_type: 'text',
            sent_at: match.last_message_at || new Date().toISOString(),
            read_at: null,
            deleted_at: null,
            first_name: match.first_name,
            dob: match.dob,
            gender: match.gender,
            message_direction: 'received' as const
          }
        }));

      return conversations;
    } else {
      console.warn('Unexpected conversations response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching last messages:', error);
    return [];
  }
};

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
