import httpClient from './httpClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPhotoUrls } from './photoApi';

// User interface matching backend response structure
export interface User {
  id: number;
  email: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  first_name: string;
  dob: string;
  gender: string;
  bio: string;
  job_title: string;
  school: string;
  location: any;
  latitude?: number;    // Thêm vị trí
  longitude?: number;   // Thêm vị trí
  distance?: number;    // Khoảng cách tính toán
  lastSeen?: Date;      // Thời gian online cuối
  isOnline?: boolean;   // Trạng thái online
  user_status: string;
  popularity_score: number;
  message_count: number;
  last_active_at: string;
  is_verified: boolean;
  is_online: boolean;
  last_seen?: string;
  photos?: string[];
  
  // UI helper fields (computed or optional)
  name?: string;
  age?: number;
  avatar?: string;
}


// Helper functions to compute UI fields
const calculateAge = (dob: string): number => {
  if (!dob) return 25; // Default age
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const calculateDistance = (): number => {
  // Placeholder - would need actual geolocation calculation
  return Math.floor(Math.random() * 50) + 1;
};

// Helper function to get current user ID
export const getCurrentUserId = async (): Promise<number> => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      return 0;
    }
    return parseInt(userId, 10);
  } catch (error) {
    console.error('Error getting user ID:', error);
    return 0;
  }
};

const enhanceUserWithUIFields = async (user: User): Promise<User> => {
  // Fetch real photos from API
  let userPhotos: string[] = [];
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('USER_NOT_LOGGED_IN');
    }
    userPhotos = await getPhotoUrls(userId);
    // console.log('Photos for user:', userPhotos);
  } catch (error) {
    console.error(`Failed to fetch photos for user ${user.id}:`, error);
  }
  
  // If no photos from API, use placeholder
  if (userPhotos.length === 0) {
    userPhotos = [
      `https://picsum.photos/400/600?random=${user.id}`,
      `https://picsum.photos/400/600?random=${user.id + 1000}`,
      `https://picsum.photos/400/600?random=${user.id + 2000}`
    ];
  }
  
  return {
    ...user,
    name: user.first_name,
    age: calculateAge(user.dob),
    distance: calculateDistance(),
    avatar: userPhotos[0], // Use first photo as avatar
    photos: userPhotos
  };
};

// Get discovery users
// Get the list of users to display on the discovery screen
export const getDiscoveryUsers = async (): Promise<User[]> => {
  try {
    const token = await getCurrentToken();
    // console.log('Token:', token);
    if (!token) {
      throw new Error('USER_NOT_LOGGED_IN');
    }
    const response = await httpClient.get('/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Get user response:', response.data.data);
    
    if (response.data.success && Array.isArray(response.data.data)) {
      // Get current user ID to exclude from discovery list
      const currentUserId = await getCurrentUserId();

      // Filter users with profiles, exclude current user, and enhance with UI fields
      const filteredUsers = response.data.data
        .filter((user: User) => user.first_name)
        .filter((user: User) => {
          if (!currentUserId) return true;
          // Some responses may use either `id` or `user_id` to reference the account
          return user.id !== currentUserId && user.user_id !== currentUserId;
        });
      
      // Use Promise.all to handle async enhanceUserWithUIFields
      const users = await Promise.all(
        filteredUsers.map((user: User) => enhanceUserWithUIFields(user))
      );
      
      // console.log('Enhanced users:', users);
      return users;
    } else {
      console.warn('Unexpected response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get token user
export const getCurrentToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Get current user profile
export const getUserProfile = async (): Promise<User> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('USER_NOT_LOGGED_IN');
    }
    
    const response = await httpClient.get(`/profile/by-user/${userId}`);
    // console.log('Profile of user response:', response.data);
    
    if (response.data.success && response.data.data) {
      return await enhanceUserWithUIFields(response.data.data);
    } else {
      throw new Error('Invalid profile response format');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Get other user profile
export const getOtherUserProfile = async (userId: string | number): Promise<User> => {
  try {
    const response = await httpClient.get(`/profile/by-user/${userId}`);
    // console.log('Profile of user response:', response.data);
    
    if (response.data.success && response.data.data) {
      return await enhanceUserWithUIFields(response.data.data);
    } else {
      throw new Error('Invalid profile response format');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Lấy profile của user còn lại trong 1 match
export const getOtherUserProfileFromMatch = async (matchId: string | number) => {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      throw new Error("USER_NOT_LOGGED_IN");
    }

    // 1. Lấy match từ backend
    const response = await httpClient.get(`/match/users/${currentUserId}/matches/${matchId}`);
    // console.log("Match response:", response.data.data);
    if (!response.data.data) {
      throw new Error("MATCH_NOT_FOUND");
    }

    const match = response.data.data;
    const user1IdNum = Number(match.user1_id);
    const user2IdNum = Number(match.user2_id);
    const currentIdNum = Number(currentUserId);

    // console.log("User1 ID:", user1IdNum);
    // console.log("User2 ID:", user2IdNum);
    // console.log("Current User ID:", currentIdNum);

    // 2. Xác định user còn lại
    let otherUserId: number;
    if (user1IdNum === currentIdNum) {
      otherUserId = user2IdNum;
    } else if (user2IdNum === currentIdNum) {
      otherUserId = user1IdNum;
    } else {
      throw new Error("USER_NOT_IN_MATCH");
    }

    // 3. Lấy profile của otherUser
    return await getOtherUserProfile(otherUserId);
  } catch (error) {
    console.error("Error fetching other user profile from match:", error);
    throw error;
  }
};


// Update user profile
export const updateUserProfile = async (profileData: Partial<User>): Promise<User> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('USER_NOT_LOGGED_IN');
    }

    // Backend expects longitude/latitude for updates. Map string location "lng,lat" if provided.
    const payload: any = { ...profileData };
    if (typeof profileData.location === 'string' && profileData.location.trim().length > 0) {
      // Accept formats: "lng,lat" or "lng lat"
      const match = profileData.location.trim().match(/^\s*(-?\d+\.?\d*)[\s,]+(-?\d+\.?\d*)\s*$/);
      if (match) {
        const lng = parseFloat(match[1]);
        const lat = parseFloat(match[2]);
        if (!Number.isNaN(lng) && !Number.isNaN(lat)) {
          payload.longitude = lng;
          payload.latitude = lat;
          delete payload.location;
        }
      }
    }

    const response = await httpClient.put(`/profile/by-user/${userId}`, payload);
    console.log('Update profile response:', response.data);
    
    if (response.data.success && response.data.data) {
      return await enhanceUserWithUIFields(response.data.data);
    } else {
      throw new Error('Invalid update response format');
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Helper functions for user ID management
export const setCurrentUserId = async (userId: number): Promise<void> => {
  try {
    await AsyncStorage.setItem('userId', userId.toString());
  } catch (error) {
    console.error('Error setting user ID:', error);
    throw new Error('Failed to save user ID');
  }
};

export const clearCurrentUserId = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('userId');
  } catch (error) {
    console.error('Error clearing user ID:', error);
  }
};

// Can extend with other functions: uploadAvatar, changePassword, ...
