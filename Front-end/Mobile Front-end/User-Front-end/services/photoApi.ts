import httpClient from './httpClient';

// Get the base URL for constructing full image URLs
const getBaseUrl = (): string => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('API URL not configured');
  }
  return apiUrl.replace('/api', '');
};

// Photo interface matching backend response
export interface Photo {
  id: number;
  user_id: number;
  url: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// API response interface
interface PhotoApiResponse {
  success: boolean;
  data: Photo[];
  message: string;
}

// Get all photos for a specific user
export const getPhotosByUserId = async (userId: number): Promise<Photo[]> => {
  try {
    // console.log('Fetching photos for user:', userId);
    const response = await httpClient.get<PhotoApiResponse>(`/photo/by-user/${userId}`);
    // console.log('Photo response:', response.data.data);
    
    if (response.data.success && Array.isArray(response.data.data)) {
      // Sort photos by order_index to ensure correct display order
      return response.data.data.sort((a, b) => a.order_index - b.order_index);
    } else {
      console.warn('Unexpected photo response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching photos for user ${userId}:`, error);
    return []; // Return empty array instead of throwing to prevent app crashes
  }
};

// Get primary photo for a user (first photo by order_index)
export const getPrimaryPhoto = async (userId: number): Promise<string | null> => {
  try {
    const response = await httpClient.get(`/photo/by-user/${userId}/primary`);
    
    if (response.data.success && response.data.data) {
      return constructFullImageUrl(response.data.data.url);
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching primary photo for user ${userId}:`, error);
    return null;
  }
};

// Get photo count for a user
export const getPhotoCount = async (userId: number): Promise<number> => {
  try {
    const response = await httpClient.get(`/photo/by-user/${userId}/count`);
    
    if (response.data.success && response.data.data) {
      return response.data.data.count || 0;
    } else {
      return 0;
    }
  } catch (error) {
    console.error(`Error fetching photo count for user ${userId}:`, error);
    return 0;
  }
};

// Helper function to construct full image URL
const constructFullImageUrl = (url: string): string => {
  if (!url) return '';
  
  // If URL is already absolute (starts with http), return as is
  if (url.startsWith('http')) {
    return url;
  }
  
  // If URL starts with /uploads/, construct full URL with /api/uploads/
  if (url.startsWith('/uploads/')) {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/api${url}`;
  }
  
  // If URL starts with uploads/ (without leading slash), add the slash
  if (url.startsWith('uploads/')) {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/api/${url}`;
  }
  
  // For any other relative URL, assume it's in uploads folder
  const baseUrl = getBaseUrl();
  return `${baseUrl}/api/uploads/${url}`;
};

// Helper function to get photo URLs array for a user
export const getPhotoUrls = async (userId: number): Promise<string[]> => {
  const photos = await getPhotosByUserId(userId);
  return photos.map(photo => constructFullImageUrl(photo.url));
};
