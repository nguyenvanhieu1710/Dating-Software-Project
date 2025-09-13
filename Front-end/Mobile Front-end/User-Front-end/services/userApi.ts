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
  popularity_score: number;
  message_count: number;
  last_active_at: string;
  is_verified: boolean;
  photos?: string[];
  
  // UI helper fields (computed or optional)
  name?: string;
  age?: number;
  distance?: number;
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

const getAvatarUrl = (userId: number, photos: string[]): string => {
  // Use first photo if available, otherwise placeholder
  if (photos && photos.length > 0) {
    return photos[0];
  }
  return `https://picsum.photos/400/600?random=${userId}`;
};

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

const enhanceUserWithUIFields = async (user: User): Promise<User> => {
  // Fetch real photos from API
  let userPhotos: string[] = [];
  try {
    userPhotos = await getPhotoUrls(user.id);
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
    const response = await httpClient.get('/user/with-profiles');
    // console.log('Backend response:', response.data.data);
    
    if (response.data.success && Array.isArray(response.data.data)) {
      // Filter users with profiles and enhance with UI fields
      const filteredUsers = response.data.data.filter((user: User) => user.first_name);
      
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

// Get current user profile
export const getUserProfile = async (): Promise<User> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('USER_NOT_LOGGED_IN');
    }
    
    const response = await httpClient.get(`/profile/by-user/${userId}`);
    console.log('Profile of user response:', response.data);
    
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

// Update user profile
export const updateUserProfile = async (profileData: Partial<User>): Promise<User> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('USER_NOT_LOGGED_IN');
    }
    
    const response = await httpClient.put(`/profile/by-user/${userId}`, profileData);
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
