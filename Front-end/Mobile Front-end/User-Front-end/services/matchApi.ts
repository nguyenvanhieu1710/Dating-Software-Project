import httpClient from './httpClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPhotoUrls } from './photoApi';

// Match interface matching backend response
export interface Match {
  id: number;
  user1_id: number;
  user2_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  other_user_id: number;
  first_name: string;
  dob: string;
  gender: string;
  bio: string;
  job_title: string;
  school: string;
  photo_url: string | null;
  message_count: number;
  last_message_at: string | null;
  
  // UI helper fields
  name?: string;
  age?: number;
  avatar?: string;
  lastMessage?: string;
  timeAgo?: string;
}

// Message interface
export interface Message {
  id: number;
  match_id: number;
  sender_id: number;
  content: string;
  message_type: 'text' | 'image' | 'video' | 'file' | 'audio';
  sent_at: string;
  read_at: string | null;
  deleted_at: string | null;
  first_name: string;
  dob: string;
  gender: string;
  message_direction: 'sent' | 'received';
  sender: {
    first_name: string;
    gender: string;
  };
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

// Helper function to calculate age from date of birth
const calculateAge = (dob: string): number => {
  if (!dob) return 25;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Helper function to format time ago
const formatTimeAgo = (dateString: string | null): string => {
  if (!dateString) return 'No messages';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString();
};

// Helper function to construct full image URL
const constructFullImageUrl = (url: string | null): string => {
  if (!url) return '';
  
  if (url.startsWith('http')) {
    return url;
  }
  
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('API URL not configured');
  }
  const baseUrl = apiUrl.replace('/api', '');
  
  if (url.startsWith('/uploads/')) {
    return `${baseUrl}/api${url}`;
  }
  
  if (url.startsWith('uploads/')) {
    return `${baseUrl}/api/${url}`;
  }
  
  return `${baseUrl}/api/uploads/${url}`;
};

// Enhance match with UI fields
const enhanceMatchWithUIFields = async (match: Match): Promise<Match> => {
  // Get photos for the other user
  let avatar = '';
  try {
    if (match.photo_url) {
      avatar = constructFullImageUrl(match.photo_url);
    } else {
      // Try to get photos from photo API
      const photos = await getPhotoUrls(match.other_user_id);
      avatar = photos.length > 0 ? photos[0] : `https://picsum.photos/400/600?random=${match.other_user_id}`;
    }
  } catch (error) {
    console.error(`Failed to get avatar for user ${match.other_user_id}:`, error);
    avatar = `https://picsum.photos/400/600?random=${match.other_user_id}`;
  }

  return {
    ...match,
    name: match.first_name,
    age: calculateAge(match.dob),
    avatar,
    timeAgo: formatTimeAgo(match.last_message_at)
  };
};

// Get all matches for current user
export const getMatches = async (): Promise<Match[]> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    const response = await httpClient.get(`/match/by-user/${userId}`);
    
    if (response.data.success && Array.isArray(response.data.data)) {
      // Enhance matches with UI fields
      const matches = await Promise.all(
        response.data.data.map((match: Match) => enhanceMatchWithUIFields(match))
      );
      
      // Sort by last message time (most recent first)
      return matches.sort((a, b) => {
        if (!a.last_message_at && !b.last_message_at) return 0;
        if (!a.last_message_at) return 1;
        if (!b.last_message_at) return -1;
        return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime();
      });
    } else {
      console.warn('Unexpected matches response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

// Get match by ID
export const getMatchById = async (matchId: number): Promise<Match | null> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    const response = await httpClient.get(`/match/${matchId}/by-user/${userId}`);
    
    if (response.data.success && response.data.data) {
      return await enhanceMatchWithUIFields(response.data.data);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching match:', error);
    return null;
  }
};

// Get messages for a match
export const getMatchMessages = async (matchId: number, limit: number = 50, offset: number = 0): Promise<Message[]> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    const response = await httpClient.get(`/match/${matchId}/by-user/${userId}/messages`, {
      params: { limit, offset }
    });
    
    if (response.data.success && Array.isArray(response.data.data)) {
      // Transform the API response to match our Message interface
      return response.data.data.map((message: any) => ({
        ...message,
        sender: {
          first_name: message.first_name,
          gender: message.gender
        }
      }));
    } else {
      console.warn('Unexpected messages response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching match messages:', error);
    throw error;
  }
};

// Send message in a match
export const sendMessage = async (matchId: number, content: string): Promise<Message | null> => {
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

// Unmatch with user
export const unmatchUser = async (matchId: number): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    const response = await httpClient.put(`/match/${matchId}/by-user/${userId}/unmatch`);
    
    return response.data.success;
  } catch (error) {
    console.error('Error unmatching user:', error);
    return false;
  }
};

// Get match statistics
export const getMatchStats = async () => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    const response = await httpClient.get(`/match/by-user/${userId}/stats`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching match stats:', error);
    return null;
  }
};
