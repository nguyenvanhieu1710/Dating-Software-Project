const BaseController = require("./BaseController");
const PhotoModel = require("../models/photoModel");

class PhotoController extends BaseController {
  constructor() {
    super(new PhotoModel());
  }

  /**
   * get all photo
   */
  async getAllPhotos(req, res) {
    try {
      const photos = await this.model.getAllPhotos();

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
   * get photo by photoId
   */
  async getPhotoById(req, res) {
    try {
      const { photoId } = req.params;
      this.validateId(photoId);

      const photo = await this.model.getPhotoById(photoId);

      res.json({
        success: true,
        data: photo,
        message: "Photo retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to get photo");
    }
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
      console.log("Body: ", req.body);
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
          let filePath = String(photo.url);

          // If URL-like (has protocol), extract pathname
          try {
            const maybeUrl = new URL(filePath);
            filePath = maybeUrl.pathname || filePath;
          } catch (_) {
            // Not a full URL; continue
          }

          // If contains '/uploads/', trim everything before it
          const uploadsMarker = '/uploads/';
          const idx = filePath.indexOf(uploadsMarker);
          if (idx >= 0) {
            filePath = filePath.substring(idx + uploadsMarker.length);
          }

          // Normalize slashes and remove any leading slashes or backslashes
          filePath = filePath.replace(/^[\\/]+/, '');

          // Resolve to absolute path inside the project's uploads directory
          const uploadsDir = path.join(__dirname, '../../../uploads');
          const fullPath = path.join(uploadsDir, filePath);

          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`Deleted file: ${fullPath}`);
          } else {
            console.warn('File not found for deletion:', fullPath);
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