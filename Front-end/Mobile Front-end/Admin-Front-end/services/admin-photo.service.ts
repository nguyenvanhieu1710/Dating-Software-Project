import { httpService } from "./http.service";
import {
  IPhoto,
  ApiResponse,
  PaginatedResponse,
  PhotoQueryParams,
  CreatePhotoRequest,
  UpdatePhotoRequest,
  CreateMultiplePhotosRequest,
} from "@/types/photo";

class PhotoService {
  private readonly basePath = "/photo";

  // ===== PHOTO OPERATIONS BY USER =====

  /**
   * Get all photos of a user
   */
  async getPhotosByUserId(userId: number): Promise<ApiResponse<IPhoto[]>> {
    return httpService.get<ApiResponse<IPhoto[]>>(
      `${this.basePath}/users/${userId}/photos`
    );
  }

  /**
   * Get primary photo of a user
   */
  async getPrimaryPhoto(userId: number): Promise<ApiResponse<IPhoto>> {
    return httpService.get<ApiResponse<IPhoto>>(
      `${this.basePath}/users/${userId}/photos/primary`
    );
  }

  /**
   * Count photos of a user
   */
  async countPhotosByUserId(
    userId: number
  ): Promise<ApiResponse<{ count: number }>> {
    return httpService.get<ApiResponse<{ count: number }>>(
      `${this.basePath}/users/${userId}/photos/count`
    );
  }

  // ===== CRUD OPERATIONS FOR PHOTOS =====

  /**
   * Get all photos with pagination
   */
  async getAllPhotos(
    params?: PhotoQueryParams
  ): Promise<ApiResponse<PaginatedResponse<IPhoto>>> {
    const queryString = this.buildQueryString(params);
    return httpService.get<ApiResponse<PaginatedResponse<IPhoto>>>(
      `${this.basePath}${queryString ? `?${queryString}` : ""}`
    );
  }

  /**
   * Get photo by ID
   */
  async getPhotoById(id: number): Promise<ApiResponse<IPhoto>> {
    return httpService.get<ApiResponse<IPhoto>>(`${this.basePath}/${id}`);
  }

  /**
   * Add a new photo
   */
  async addPhoto(photoData: CreatePhotoRequest): Promise<ApiResponse<IPhoto>> {
    return httpService.post<ApiResponse<IPhoto>>(this.basePath, photoData);
  }

  /**
   * Upload multiple photos
   */
  async uploadMultiplePhotos(
    photosData: CreateMultiplePhotosRequest
  ): Promise<ApiResponse<IPhoto[]>> {
    return httpService.post<ApiResponse<IPhoto[]>>(
      `${this.basePath}/multiple`,
      photosData
    );
  }

  /**
   * Update photo order
   */
  async updatePhotoOrder(
    photoId: number,
    orderIndex: number
  ): Promise<ApiResponse<IPhoto>> {
    return httpService.put<ApiResponse<IPhoto>>(
      `${this.basePath}/${photoId}/order`,
      { order_index: orderIndex }
    );
  }

  /**
   * Update photo
   */
  async updatePhoto(
    photoId: number,
    photoData: UpdatePhotoRequest
  ): Promise<ApiResponse<IPhoto>> {
    return httpService.put<ApiResponse<IPhoto>>(
      `${this.basePath}/${photoId}`,
      photoData
    );
  }

  /**
   * Delete a photo
   */
  async deletePhoto(
    photoId: number,
    userId: number
  ): Promise<ApiResponse<void>> {
    return httpService.delete<ApiResponse<void>>(
      `${this.basePath}/${photoId}/users/${userId}`
    );
  }

  // ===== VALIDATION METHODS =====

  /**
   * Validate photo data before create/update
   */
  validatePhotoData(
    photoData: CreatePhotoRequest | UpdatePhotoRequest
  ): string[] {
    const errors: string[] = [];

    if ("user_id" in photoData) {
      if (!photoData.user_id || photoData.user_id < 1) {
        errors.push("Valid user_id is required");
      }
    }

    if ("url" in photoData) {
      if (!photoData.url || photoData.url.trim().length === 0) {
        errors.push("Photo URL is required");
      } else if (!this.validateUrl(photoData.url)) {
        errors.push("Invalid photo URL format");
      }
    }

    if (photoData.order_index !== undefined) {
      if (photoData.order_index < 0) {
        errors.push("Order index must be greater than or equal to 0");
      }
    }

    return errors;
  }

  /**
   * Validate multiple photos data
   */
  validateMultiplePhotosData(
    photosData: CreateMultiplePhotosRequest
  ): string[] {
    const errors: string[] = [];

    if (!photosData.user_id || photosData.user_id < 1) {
      errors.push("Valid user_id is required");
    }

    if (!photosData.photos || !Array.isArray(photosData.photos)) {
      errors.push("Photos array is required");
    } else if (photosData.photos.length === 0) {
      errors.push("Photos array cannot be empty");
    } else if (photosData.photos.length > 10) {
      errors.push("Cannot upload more than 10 photos at once");
    } else {
      photosData.photos.forEach((photo, index) => {
        if (!photo.url || photo.url.trim().length === 0) {
          errors.push(`Photo at index ${index}: URL is required`);
        } else if (!this.validateUrl(photo.url)) {
          errors.push(`Photo at index ${index}: Invalid URL format`);
        }

        if (photo.order_index !== undefined && photo.order_index < 0) {
          errors.push(`Photo at index ${index}: Order index must be >= 0`);
        }
      });
    }

    return errors;
  }

  /**
   * Validate URL format
   */
  private validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      // If not a full URL, check if it's a valid relative path
      return /^\/[\w\-\/\.]+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    }
  }

  /**
   * Validate pagination params
   */
  validatePaginationParams(params: PhotoQueryParams): string[] {
    const errors: string[] = [];

    if (params.page !== undefined && params.page < 1) {
      errors.push("Page must be greater than 0");
    }

    if (
      params.limit !== undefined &&
      (params.limit < 1 || params.limit > 100)
    ) {
      errors.push("Limit must be between 1 and 100");
    }

    return errors;
  }

  // ===== UTILITY METHODS =====

  /**
   * Build query string from params object
   */
  private buildQueryString(params?: Record<string, any>): string {
    if (!params) return "";

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }

  /**
   * Format photo for display
   */
  public formatPhotoForDisplay(photo: IPhoto): IPhoto & {
    url_display: string;
    created_at_formatted: string;
    is_primary: boolean;
  } {
    const urlDisplay = this.formatPhotoUrl(photo.url);
    const createdAtFormatted = this.formatDate(new Date(photo.created_at));

    return {
      ...photo,
      url_display: urlDisplay,
      created_at_formatted: createdAtFormatted,
      is_primary: photo.order_index === 0,
    };
  }

  /**
   * Format photo URL for display (handle relative/absolute URLs)
   */
  private formatPhotoUrl(url: string): string {
    // If it's already an absolute URL, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // If it's a relative URL, you might want to prepend your base URL
    // For now, return as is
    return url;
  }

  /**
   * Format date to readable string
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US");
  }

  /**
   * Sort photos by order index
   */
  public sortPhotosByOrder(photos: IPhoto[]): IPhoto[] {
    return [...photos].sort((a, b) => {
      if (a.order_index !== b.order_index) {
        return a.order_index - b.order_index;
      }
      // If order_index is the same, sort by created_at
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  }

  /**
   * Get photo statistics for a user
   */
  public getPhotoStatistics(photos: IPhoto[]): {
    total: number;
    public: number;
    private: number;
    hasPrimary: boolean;
  } {
    return {
      total: photos.length,
      public: photos.filter((p) => p.is_public).length,
      private: photos.filter((p) => !p.is_public).length,
      hasPrimary: photos.some((p) => p.order_index === 0),
    };
  }

  /**
   * Reorder photos after deletion
   */
  public calculateNewOrder(
    photos: IPhoto[],
    deletedOrderIndex: number
  ): IPhoto[] {
    return photos
      .filter((p) => p.order_index !== deletedOrderIndex)
      .map((p) => ({
        ...p,
        order_index:
          p.order_index > deletedOrderIndex ? p.order_index - 1 : p.order_index,
      }));
  }
}

// Export singleton instance
export const photoService = new PhotoService();
