import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { Snackbar, useTheme } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { photoService } from "@/services/admin-photo.service";
import { IPhoto } from "@/types/photo";
import { adminUserService } from "@/services/admin-user.service";
import { IUser } from "@/types/user";

import PhotoHeader from "@/features/photo/PhotoHeader";
import PhotoSearchBar from "@/features/photo/PhotoSearchBar";
import PhotoGrid from "@/features/photo/PhotoGrid";
import PhotoDetailDialog from "@/features/photo/PhotoDetailModal";
import DeleteConfirmDialog from "@/features/photo/DeleteConfirmDialog";
import UploadPhotoDialog from "@/features/photo/UploadPhotoDialog";

export default function PhotoManagement() {
  const theme = useTheme();

  // ===== State =====
  const [photos, setPhotos] = React.useState<IPhoto[]>([]);
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal/dialog states
  const [selectedPhoto, setSelectedPhoto] = React.useState<IPhoto | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<IPhoto | null>(null);
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
      const res = await photoService.getAllPhotos({
        page: 1,
        limit: 20,
        sort_by: "created_at",
        sort_order: "desc",
      });
      console.log(res);
      if (res.success && Array.isArray(res.data)) {
        const formatted = res.data.map((p) =>
          photoService.formatPhotoForDisplay(p)
        );
        setPhotos(photoService.sortPhotosByOrder(formatted));
      } else {
        showSnackbar("Failed to load photos");
      }
    } catch (err) {
      console.error("Load photos error:", err);
      showSnackbar("Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminUserService.getAllUsers();
      // console.log("Users:", res);
      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        showSnackbar("Failed to load users");
      }
    } catch (err) {
      console.error("Load users error:", err);
      showSnackbar("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPhotos();
    loadUsers();
  }, [searchQuery]);

  // ===== Handlers =====
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setLoading(true);
      const success = await photoService.deletePhoto(
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
      // TODO: call photoService.uploadPhoto với ảnh từ gallery
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
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        showSnackbar("Upload cancelled");
        return;
      }

      const selectedFile = result.assets[0];
      console.log("Selected file:", selectedFile);

      const uploadRes = await photoService.uploadPhoto({
        uri: selectedFile.uri,
        type: selectedFile.mimeType || "image/jpeg",
        name: selectedFile.name || "photo.jpg",
      });

      if (!uploadRes.success || !uploadRes.url) {
        showSnackbar(uploadRes.message || "File upload failed");
        return;
      }

      console.log("Upload result:", uploadRes);

      const addRes = await photoService.addPhoto({
        user_id: Number(uploadUserId),
        url: uploadRes.url,
        order_index: 0,
        is_public: false,
      });

      if (addRes.success) {
        showSnackbar("Photo uploaded successfully 🎉");
        setShowUpload(false);
        await loadPhotos();
      } else {
        showSnackbar(addRes.message || "Failed to save photo info");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      showSnackbar("Upload failed: " + (err?.message || ""));
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
            users={users}
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
        users={users}
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
        users={users}
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
