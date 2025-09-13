import { apiClient } from './apiClient';

export interface ProfileData {
  id?: string;
  userId: string;
  displayName: string;
  bio?: string;
  gender: string;
  dateOfBirth: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  photos: string[];
  interests?: string[];
  height?: number;
  education?: string;
  jobTitle?: string;
  company?: string;
  relationshipGoals?: string;
  distancePreference?: number;
  ageRange?: {
    min: number;
    max: number;
  };
  lastActive?: Date;
  popularityScore?: number;
}

class ProfileService {
  // Get current user's profile
  public static async getMyProfile(): Promise<ProfileData> {
    try {
      return await apiClient.get('/profiles/me');
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Get profile by user ID
  public static async getProfileByUserId(userId: string): Promise<ProfileData> {
    try {
      return await apiClient.get(`/profiles/by-user/${userId}`);
    } catch (error) {
      console.error('Get profile by user ID error:', error);
      throw error;
    }
  }

  // Create or update profile
  public static async updateProfile(profileData: Partial<ProfileData>): Promise<ProfileData> {
    try {
      return await apiClient.put('/profiles/by-user/me', profileData);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Upload profile photo
  public static async uploadPhoto(photo: any): Promise<{ url: string }> {
    try {
      return await apiClient.upload('/photos', photo);
    } catch (error) {
      console.error('Upload photo error:', error);
      throw error;
    }
  }

  // Delete profile photo
  public static async deletePhoto(photoId: string): Promise<void> {
    try {
      await apiClient.delete(`/photos/${photoId}`);
    } catch (error) {
      console.error('Delete photo error:', error);
      throw error;
    }
  }

  // Search profiles
  public static async searchProfiles(params: {
    gender?: string;
    minAge?: number;
    maxAge?: number;
    distance?: number;
    interests?: string[];
    page?: number;
    limit?: number;
  }): Promise<{ data: ProfileData[]; total: number }> {
    try {
      return await apiClient.get('/profiles/search', { params });
    } catch (error) {
      console.error('Search profiles error:', error);
      throw error;
    }
  }

  // Get potential matches
  public static async getPotentialMatches(params?: {
    page?: number;
    limit?: number;
  }): Promise<{ data: ProfileData[]; total: number }> {
    try {
      return await apiClient.get('/profiles/by-user/me/potential-matches', { params });
    } catch (error) {
      console.error('Get potential matches error:', error);
      throw error;
    }
  }

  // Update last active timestamp
  public static async updateLastActive(): Promise<void> {
    try {
      await apiClient.put('/profiles/by-user/me/last-active');
    } catch (error) {
      console.error('Update last active error:', error);
      throw error;
    }
  }
}

export default ProfileService;
