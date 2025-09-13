const BaseController = require("./BaseController");
const PhotoModel = require("../models/photoModel");

class PhotoController extends BaseController {
  constructor() {
    super(new PhotoModel());
  }

  /**
   * Lấy tất cả ảnh của user
   */
  async getPhotosByUserId(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const photos = await this.model.findByUserId(userId);

      res.json({
        success: true,
        data: photos,
        message: "Photos retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get photos");
    }
  }

  /**
   * Thêm ảnh mới
   */
  async addPhoto(req, res) {
    try {
      this.validateRequiredFields(req, [
        "user_id", "url"
      ]);

      const photo = await this.model.addPhoto(req.body);

      res.status(201).json({
        success: true,
        data: photo,
        message: "Photo added successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to add photo");
    }
  }

  /**
   * Cập nhật thứ tự ảnh
   */
  async updatePhotoOrder(req, res) {
    try {
      const { photoId } = req.params;
      this.validateId(photoId);

      this.validateRequiredFields(req, ["order_index"]);

      const photo = await this.model.updatePhotoOrder(photoId, req.body.order_index);

      if (!photo) {
        return res.status(404).json({
          success: false,
          message: "Photo not found",
        });
      }

      res.json({
        success: true,
        data: photo,
        message: "Photo order updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update photo order");
    }
  }

  /**
   * Xóa ảnh
   */
  async deletePhoto(req, res) {
    try {
      const { photoId, userId } = req.params;
      console.log("PhotoId: ", photoId);
      console.log("UserId: ", userId);
      this.validateId(photoId);
      this.validateId(userId);

      // Get photo info before deleting to get file path
      const photo = await this.model.getPhotoById(photoId);
      console.log("Photo found: ", photo);
      if (!photo || parseInt(photo.user_id) !== parseInt(userId)) {
        return res.status(404).json({
          success: false,
          message: "Photo not found or access denied",
        });
      }

      // Delete from database
      const success = await this.model.deletePhoto(photoId, userId);
      console.log("Delete success: ", success);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Failed to delete photo from database",
        });
      }

      // Delete physical file from uploads folder
      if (photo.url) {
        const fs = require('fs');
        const path = require('path');
        
        try {
          // Extract file path from URL (remove domain/base URL if present)
          let filePath = photo.url;
          if (filePath.includes('/uploads/')) {
            filePath = filePath.substring(filePath.indexOf('/uploads/'));
          }
          
          // Construct full file path
          const fullPath = path.join(__dirname, '../../../..', filePath);
          
          // Check if file exists and delete it
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`Deleted file: ${fullPath}`);
          }
        } catch (fileError) {
          console.error('Error deleting file:', fileError);
          // Don't fail the entire operation if file deletion fails
        }
      }

      res.json({
        success: true,
        message: "Photo deleted successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to delete photo");
    }
  }

  /**
   * Đếm số ảnh của user
   */
  async countPhotosByUserId(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const count = await this.model.countByUserId(userId);

      res.json({
        success: true,
        data: { count },
        message: "Photo count retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to count photos");
    }
  }

  /**
   * Lấy ảnh chính của user
   */
  async getPrimaryPhoto(req, res) {
    try {
      const { userId } = req.params;
      this.validateId(userId);

      const photo = await this.model.getPrimaryPhoto(userId);

      if (!photo) {
        return res.status(404).json({
          success: false,
          message: "No photos found for this user",
        });
      }

      res.json({
        success: true,
        data: photo,
        message: "Primary photo retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get primary photo");
    }
  }

  /**
   * Upload nhiều ảnh
   */
  async uploadMultiplePhotos(req, res) {
    try {
      this.validateRequiredFields(req, ["user_id", "photos"]);

      const { user_id, photos } = req.body;
      const uploadedPhotos = [];

      for (let i = 0; i < photos.length; i++) {
        const photo = await this.model.addPhoto({
          user_id,
          url: photos[i].url,
          order_index: photos[i].order_index || i
        });
        uploadedPhotos.push(photo);
      }

      res.status(201).json({
        success: true,
        data: uploadedPhotos,
        message: "Multiple photos uploaded successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to upload multiple photos");
    }
  }
}

module.exports = PhotoController; 