import { apiClient } from "./apiClient";

// Get the backend base URL for constructing image URLs
const getBackendBaseUrl = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return apiUrl;
};

// Helper function to construct full image URL
const constructImageUrl = (relativeUrl: string): string => {
  if (!relativeUrl) return "";

  // If it's already a full URL, return as is
  if (relativeUrl.startsWith("http://") || relativeUrl.startsWith("https://")) {
    return relativeUrl;
  }

  const baseUrl = getBackendBaseUrl();
  // Remove leading slash if present to avoid double slashes
  const cleanRelativeUrl = relativeUrl.startsWith("/")
    ? relativeUrl.substring(1)
    : relativeUrl;

  // Construct the full URL
  return `${baseUrl}/${cleanRelativeUrl}`;
};

export interface AdminPhoto {
  id: number;
  user_id: number;
  url: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
  is_primary?: boolean;
  status: "active" | "reported" | "removed";
  report_count?: number;
}

export interface PhotoFilters {
  user_id?: number;
  status?: "active" | "reported" | "removed" | "all";
  search?: string;
  sort_by?: "created_at" | "user_name" | "status" | "reports";
  sort_order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PhotoStats {
  total_photos: number;
  active_photos: number;
  reported_photos: number;
  removed_photos: number;
  photos_today: number;
}

class AdminPhotoService {
  private static instance: AdminPhotoService;

  public static getInstance(): AdminPhotoService {
    if (!AdminPhotoService.instance) {
      AdminPhotoService.instance = new AdminPhotoService();
    }
    return AdminPhotoService.instance;
  }

  // Get all photos with user information for admin management
  public async getAllPhotos(filters: PhotoFilters = {}): Promise<{
    photos: AdminPhoto[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    try {
      // Since backend doesn't have admin photo endpoints, we'll need to get all users and their photos
      const usersResponse = await apiClient.get<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
      }>("/user"); // Get all users

      const allPhotos: AdminPhoto[] = [];

      // For each user, get their photos
      for (const user of usersResponse.data) {
        try {
          const userPhotos = await apiClient.get<{
            success: boolean;
            data: any[];
            message: string;
          }>(`/photo/by-user/${user.id}`);

          if (userPhotos.success && userPhotos.data) {
            const photosWithUserInfo = userPhotos.data.map(
              (photo: any, index: number) => ({
                id: photo.id,
                user_id: photo.user_id,
                url: constructImageUrl(photo.url), // Construct full image URL
                order_index: photo.order_index,
                created_at: photo.created_at,
                updated_at: photo.updated_at,
                user_name: user.first_name,
                user_email: user.email,
                is_primary: index === 0, // First photo is primary
                status: "active" as const, // Default status since backend doesn't track this
                report_count: 0, // Default since backend doesn't track this
              })
            );
            allPhotos.push(...photosWithUserInfo);
            // console.log("All photos: ", allPhotos);
          }
        } catch (error) {
          console.warn(`Failed to get photos for user ${user.id}:`, error);
          // Continue with other users
        }
      }

      // Apply filters
      let filteredPhotos = [...allPhotos];

      if (filters.search) {
        filteredPhotos = filteredPhotos.filter(
          (photo) =>
            photo.user_name
              ?.toLowerCase()
              .includes(filters.search!.toLowerCase()) ||
            photo.user_email
              ?.toLowerCase()
              .includes(filters.search!.toLowerCase()) ||
            photo.id.toString().includes(filters.search!)
        );
      }

      if (filters.status && filters.status !== "all") {
        filteredPhotos = filteredPhotos.filter(
          (photo) => photo.status === filters.status
        );
      }

      if (filters.user_id) {
        filteredPhotos = filteredPhotos.filter(
          (photo) => photo.user_id === filters.user_id
        );
      }

      // Apply sorting
      if (filters.sort_by) {
        filteredPhotos.sort((a, b) => {
          let aValue: any, bValue: any;

          switch (filters.sort_by) {
            case "created_at":
              aValue = new Date(a.created_at);
              bValue = new Date(b.created_at);
              break;
            case "user_name":
              aValue = a.user_name?.toLowerCase() || "";
              bValue = b.user_name?.toLowerCase() || "";
              break;
            case "status":
              aValue = a.status;
              bValue = b.status;
              break;
            case "reports":
              aValue = a.report_count || 0;
              bValue = b.report_count || 0;
              break;
            default:
              return 0;
          }

          const order = filters.sort_order === "asc" ? 1 : -1;
          if (aValue < bValue) return -1 * order;
          if (aValue > bValue) return 1 * order;
          return 0;
        });
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPhotos = filteredPhotos.slice(startIndex, endIndex);
      const totalPages = Math.ceil(filteredPhotos.length / limit);

      return {
        photos: paginatedPhotos,
        total: filteredPhotos.length,
        page,
        limit,
        total_pages: totalPages,
      };
    } catch (error) {
      console.error("Get all photos error:", error);
      throw error;
    }
  }

  // Get photos by user ID
  public async getPhotosByUserId(userId: number): Promise<AdminPhoto[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any[];
        message: string;
      }>(`photo/by-user/${userId}`);

      if (!response.success) {
        throw new Error(response.message);
      }

      // Get user info
      const userResponse = await apiClient.get<{
        success: boolean;
        data: any;
      }>(`/user/${userId}`);

      const user = userResponse.success ? userResponse.data : null;

      return response.data.map((photo: any, index: number) => ({
        id: photo.id,
        user_id: photo.user_id,
        url: constructImageUrl(photo.url), // Construct full image URL
        order_index: photo.order_index,
        created_at: photo.created_at,
        updated_at: photo.updated_at,
        user_name: user?.first_name,
        user_email: user?.email,
        is_primary: index === 0,
        status: "active" as const,
        report_count: 0,
      }));
    } catch (error) {
      console.error("Get photos by user ID error:", error);
      throw error;
    }
  }

  // Delete photo
  public async deletePhoto(photoId: number, userId: number): Promise<boolean> {
    try {
      // console.log("PhotoId: ", photoId);
      const response = await apiClient.delete<{
        success: boolean;
        message: string;
      }>(`/photo/delete/${photoId}/${userId}`);

      return response.success;
    } catch (error) {
      console.error("Delete photo error:", error);
      throw error;
    }
  }

  // Update photo order
  public async updatePhotoOrder(
    photoId: number,
    orderIndex: number
  ): Promise<boolean> {
    try {
      const response = await apiClient.put<{
        success: boolean;
        data: any;
        message: string;
      }>(`/photo/${photoId}/order`, { order_index: orderIndex });

      return response.success;
    } catch (error) {
      console.error("Update photo order error:", error);
      throw error;
    }
  }

  // Get photo statistics
  public async getPhotoStats(): Promise<PhotoStats> {
    try {
      // Since we don't have a dedicated stats endpoint, we'll calculate from all photos
      const allPhotosResponse = await this.getAllPhotos({ limit: 10000 });
      const photos = allPhotosResponse.photos;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const stats: PhotoStats = {
        total_photos: photos.length,
        active_photos: photos.filter((p) => p.status === "active").length,
        reported_photos: photos.filter((p) => p.status === "reported").length,
        removed_photos: photos.filter((p) => p.status === "removed").length,
        photos_today: photos.filter((p) => new Date(p.created_at) >= today)
          .length,
      };

      return stats;
    } catch (error) {
      console.error("Get photo stats error:", error);
      throw error;
    }
  }

  // Get photo count by user
  public async getPhotoCountByUser(userId: number): Promise<number> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { count: number };
        message: string;
      }>(`/photo/by-user/${userId}/count`);

      return response.success ? response.data.count : 0;
    } catch (error) {
      console.error("Get photo count error:", error);
      return 0;
    }
  }

  // Get primary photo by user
  public async getPrimaryPhotoByUser(
    userId: number
  ): Promise<AdminPhoto | null> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any;
        message: string;
      }>(`/photo/by-user/${userId}/primary`);

      if (!response.success || !response.data) {
        return null;
      }

      // Get user info
      const userResponse = await apiClient.get<{
        success: boolean;
        data: any;
      }>(`/user/${userId}`);

      const user = userResponse.success ? userResponse.data : null;

      return {
        id: response.data.id,
        user_id: response.data.user_id,
        url: constructImageUrl(response.data.url), // Construct full image URL
        order_index: response.data.order_index,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
        user_name: user?.first_name,
        user_email: user?.email,
        is_primary: true,
        status: "active" as const,
        report_count: 0,
      };
    } catch (error) {
      console.error("Get primary photo error:", error);
      return null;
    }
  }

  // Simulate photo status update (since backend doesn't support this yet)
  public async updatePhotoStatus(
    photoId: number,
    status: "active" | "reported" | "removed"
  ): Promise<boolean> {
    try {
      // This is a simulation since the backend doesn't support photo status updates
      // In a real implementation, this would call a backend endpoint
      console.log(`Simulating photo ${photoId} status update to ${status}`);
      return true;
    } catch (error) {
      console.error("Update photo status error:", error);
      throw error;
    }
  }

  // Upload photo for a user
  public async uploadPhoto(photoAsset: any, userId: number): Promise<boolean> {
    try {
      // Step 1: Convert photo to blob and upload file
      const response = await fetch(photoAsset.uri);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('file', blob, photoAsset.fileName || photoAsset.name || 'photo.jpg');
      
      const uploadResponse = await fetch(process.env.EXPO_PUBLIC_API_URL + '/upload/single', {
        method: 'POST',
        body: formData,
      });
      
      const result = await uploadResponse.json();
      console.log("Upload result:", result);
      
      if (!result.success || !result.file) {
        throw new Error(result.message || "File upload failed");
      }

      // Step 2: Save photo record to database
      const photoData = {
        user_id: userId,
        url: result.file.path,
        order_index: 0, // Default order
      };
      console.log("Photo data:", photoData);
      const photoResponse = await this.addPhotoRecord(photoData);

      return photoResponse;
    } catch (error) {
      console.error("Upload photo error:", error);
      throw error;
    }
  }

  // Add photo record to database
  public async addPhotoRecord(photoData: {
    user_id: number;
    url: string;
    order_index: number;
  }): Promise<boolean> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        data?: any;
        message: string;
      }>("/photo", photoData);

      return response.success;
    } catch (error) {
      console.error("Add photo record error:", error);
      throw error;
    }
  }
}

export const adminPhotoService = AdminPhotoService.getInstance();
