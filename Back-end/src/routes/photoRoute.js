const express = require("express");
const PhotoController = require("../app/controllers/photoController");
const photoController = new PhotoController();

const router = express.Router();

// Photo routes - Order matters for Express routing!
// Specific routes first
// new route
// Đếm số lượng photos của user
router.get("/users/:userId/photos/count", (req, res) =>
  photoController.countPhotosByUserId(req, res)
);

// Lấy ảnh chính (primary) của user
router.get("/users/:userId/photos/primary", (req, res) =>
  photoController.getPrimaryPhoto(req, res)
);

// Lấy tất cả photos của user
router.get("/users/:userId/photos", (req, res) =>
  photoController.getPhotosByUserId(req, res)
);
// old route
router.get("/by-user/:userId/count", (req, res) =>
  photoController.countPhotosByUserId(req, res)
);
router.get("/by-user/:userId/primary", (req, res) =>
  photoController.getPrimaryPhoto(req, res)
);
router.get("/by-user/:userId", (req, res) =>
  photoController.getPhotosByUserId(req, res)
);

// Generic routes after specific ones
router.get("/", (req, res) => photoController.getAllPhotos(req, res));
router.get("/:photoId", (req, res) => photoController.getPhotoById(req, res));
router.post("/", (req, res) => photoController.addPhoto(req, res));
router.post("/multiple", (req, res) =>
  photoController.uploadMultiplePhotos(req, res)
);
router.put("/:photoId/order", (req, res) =>
  photoController.updatePhotoOrder(req, res)
);

// Alternative delete endpoint to avoid route conflicts
router.delete("/delete/:photoId/:userId", (req, res) =>
  photoController.deletePhoto(req, res)
);
router.delete("/:photoId/by-user/:userId", (req, res) =>
  photoController.deletePhoto(req, res)
);

module.exports = router;
