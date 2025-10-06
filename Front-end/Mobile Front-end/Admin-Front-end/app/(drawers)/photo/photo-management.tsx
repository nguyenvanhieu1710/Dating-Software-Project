import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { Snackbar, useTheme } from "react-native-paper";
import { adminPhotoService, AdminPhoto } from "@/services/adminPhotoService";

import PhotoHeader from "@/features/photo/PhotoHeader";
import PhotoSearchBar from "@/features/photo/PhotoSearchBar";
import PhotoGrid from "@/features/photo/PhotoGrid";
import PhotoDetailDialog from "@/features/photo/PhotoDetailModal";
import DeleteConfirmDialog from "@/features/photo/DeleteConfirmDialog";
import UploadPhotoDialog from "@/features/photo/UploadPhotoDialog";

export default function PhotoManagement() {
  const theme = useTheme();

  // ===== State =====
  const [photos, setPhotos] = React.useState<AdminPhoto[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal/dialog states
  const [selectedPhoto, setSelectedPhoto] = React.useState<AdminPhoto | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = React.useState<AdminPhoto | null>(
    null
  );
  const [showUpload, setShowUpload] = React.useState(false);
  const [uploadUserId, setUploadUserId] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  // Snackbar
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);

  // ===== Load Photos =====
  const loadPhotos = async () => {
    try {
      setLoading(true);
      const res = await adminPhotoService.getAllPhotos({
        search: searchQuery || undefined,
        page: 1,
        limit: 20,
      });
      setPhotos(res.photos);
    } catch (err) {
      console.error("Load photos error:", err);
      showSnackbar("Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPhotos();
  }, [searchQuery]);

  // ===== Handlers =====
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setLoading(true);
      const success = await adminPhotoService.deletePhoto(
        deleteTarget.id,
        deleteTarget.user_id
      );
      if (success) {
        showSnackbar("Photo deleted successfully");
        await loadPhotos();
      } else {
        showSnackbar("Failed to delete photo");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showSnackbar("Delete failed");
    } finally {
      setDeleteTarget(null);
      setLoading(false);
    }
  };

  const handleUploadFromGallery = async () => {
    if (!uploadUserId) return;
    setUploading(true);
    try {
      // TODO: call adminPhotoService.uploadPhoto với ảnh từ gallery
      showSnackbar("Photo uploaded (gallery) - demo");
      setShowUpload(false);
      await loadPhotos();
    } catch (err) {
      showSnackbar("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadFromComputer = async () => {
    if (!uploadUserId) return;
    setUploading(true);
    try {
      // TODO: call adminPhotoService.uploadPhoto với ảnh từ computer
      showSnackbar("Photo uploaded (computer) - demo");
      setShowUpload(false);
      await loadPhotos();
    } catch (err) {
      showSnackbar("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const showSnackbar = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <PhotoHeader onUpload={() => setShowUpload(true)} />

      {/* Search */}
      <PhotoSearchBar query={searchQuery} onChangeQuery={setSearchQuery} />

      {/* Grid */}
      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 24 }}
          size="large"
          color={theme.colors.primary}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <PhotoGrid
            photos={photos}
            onView={(p) => setSelectedPhoto(p)}
            onDelete={(p) => setDeleteTarget(p)}
            isLoading={false}
          />
        </View>
      )}

      {/* Detail dialog */}
      <PhotoDetailDialog
        visible={!!selectedPhoto}
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />

      {/* Delete dialog */}
      <DeleteConfirmDialog
        visible={!!deleteTarget}
        photo={deleteTarget}
        loading={loading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      {/* Upload dialog */}
      <UploadPhotoDialog
        visible={showUpload}
        userId={uploadUserId}
        loading={uploading}
        onClose={() => setShowUpload(false)}
        onChangeUserId={setUploadUserId}
        onPickFromGallery={handleUploadFromGallery}
        onPickFromComputer={handleUploadFromComputer}
      />

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.primary }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}
