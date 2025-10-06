import * as React from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { FAB, Snackbar, TextInput, useTheme } from "react-native-paper";
import SettingTable from "@/features/setting/SettingTable";
import SettingDialog from "@/features/setting/SettingDialog";
import { adminSettingService } from "@/services/admin-setting.service";
import { ISetting } from "@/types/setting";
import PaginationControls from "@/components/paginations/TablePagination";

// Custom hooks để tách logic
const useSettingData = () => {
  const [settings, setSettings] = React.useState<ISetting[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminSettingService.getAllSettings();
      if (response.success) {
        setSettings(response.data);
      } else {
        setError(response.message || "Không thể tải danh sách settings");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tải danh sách settings");
      console.error("Fetch settings error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    setSettings,
    loading,
    setLoading,
    error,
    setError,
    fetchSettings,
  };
};

const useSettingOperations = (
  setSettings: React.Dispatch<React.SetStateAction<ISetting[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const handleCreate = async (setting: ISetting): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      console.log("create setting: ", setting);

      const response = await adminSettingService.createSetting({
        user_id: setting.user_id,
        preferred_gender: setting.preferred_gender,
        min_age: setting.min_age,
        max_age: setting.max_age,
        max_distance_km: setting.max_distance_km,
        show_me: setting.show_me,
        is_discoverable: setting.is_discoverable,
        hide_age: setting.hide_age,
        hide_distance: setting.hide_distance,
        show_last_active: setting.show_last_active,
        show_online_status: setting.show_online_status,
        block_messages_from_strangers: setting.block_messages_from_strangers,
        new_matches_notification: setting.new_matches_notification,
        new_messages_notification: setting.new_messages_notification,
        message_likes_notification: setting.message_likes_notification,
        message_super_likes_notification: setting.message_super_likes_notification,
        profile_views_notification: setting.profile_views_notification,
        email_notifications: setting.email_notifications,
        push_notifications: setting.push_notifications,
        promotional_emails: setting.promotional_emails,
        language: setting.language,
        theme: setting.theme,
        account_type: setting.account_type,
        verification_status: setting.verification_status,
        preferences: setting.preferences,
      });

      if (response.success) {
        setSettings((prev) => [...prev, response.data]);
        return true;
      } else {
        setError(response.message || "Không thể tạo setting");
        return false;
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tạo setting");
      console.error("Create setting error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (setting: ISetting): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      console.log("update setting: ", setting);

      const response = await adminSettingService.updateSetting(
        setting.user_id,
        {
          preferred_gender: setting.preferred_gender,
          min_age: setting.min_age,
          max_age: setting.max_age,
          max_distance_km: setting.max_distance_km,
          show_me: setting.show_me,
          is_discoverable: setting.is_discoverable,
          hide_age: setting.hide_age,
          hide_distance: setting.hide_distance,
          show_last_active: setting.show_last_active,
          show_online_status: setting.show_online_status,
          block_messages_from_strangers: setting.block_messages_from_strangers,
          new_matches_notification: setting.new_matches_notification,
          new_messages_notification: setting.new_messages_notification,
          message_likes_notification: setting.message_likes_notification,
          message_super_likes_notification: setting.message_super_likes_notification,
          profile_views_notification: setting.profile_views_notification,
          email_notifications: setting.email_notifications,
          push_notifications: setting.push_notifications,
          promotional_emails: setting.promotional_emails,
          language: setting.language,
          theme: setting.theme,
          account_type: setting.account_type,
          verification_status: setting.verification_status,
          preferences: setting.preferences,
        }
      );

      if (response.success) {
        setSettings((prev) =>
          prev.map((s) => (s.user_id === setting.user_id ? response.data : s))
        );
        return true;
      } else {
        setError(response.message || "Không thể cập nhật setting");
        return false;
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi cập nhật setting");
      console.error("Update setting error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (setting: ISetting) => {
    Alert.alert(
      "Xác nhận reset",
      `Bạn có chắc chắn muốn reset setting của User #${setting.user_id} về mặc định?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            setError(null);
            try {
              const response = await adminSettingService.resetSettings(
                setting.user_id
              );
              if (response.success) {
                setSettings((prev) =>
                  prev.map((s) =>
                    s.user_id === setting.user_id ? response.data : s
                  )
                );
              } else {
                setError(response.message || "Không thể reset setting");
              }
            } catch (err) {
              setError("Đã có lỗi xảy ra khi reset setting");
              console.error("Reset setting error:", err);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return {
    handleCreate,
    handleUpdate,
    handleReset,
  };
};

export default function SettingManagement() {
  const theme = useTheme();
  const {
    settings,
    setSettings,
    loading,
    setLoading,
    error,
    setError,
    fetchSettings,
  } = useSettingData();

  const { handleCreate, handleUpdate, handleReset } = useSettingOperations(
    setSettings,
    setLoading,
    setError
  );

  // Dialog state
  const [selectedSetting, setSelectedSetting] =
    React.useState<ISetting | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Filter
  const filtered = React.useMemo(() => {
    if (!searchTerm.trim()) return settings;
    return settings.filter(
      (s) =>
        s.user_id.toString().includes(searchTerm.trim()) ||
        s.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.account_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, settings]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Load settings on mount
  React.useEffect(() => {
    fetchSettings();
  }, []);

  // Show snackbar for success messages
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // Handler thêm mới
  const handleAdd = () => {
    setSelectedSetting(null);
    setOpenDialog(true);
  };

  // Handler sửa
  const handleEdit = (setting: ISetting) => {
    setSelectedSetting(setting);
    setOpenDialog(true);
  };

  // Handler lưu (thêm mới hoặc cập nhật)
  const handleSave = async (setting: ISetting) => {
    let success = false;

    if (selectedSetting) {
      success = await handleUpdate(setting);
      if (success) {
        showSnackbar("Cập nhật setting thành công!");
        fetchSettings();
      }
    } else {
      success = await handleCreate(setting);
      if (success) {
        showSnackbar("Tạo setting thành công!");
        fetchSettings();
      }
    }

    if (success) {
      setOpenDialog(false);
    }
  };

  // Clear error khi đóng snackbar
  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
    if (error) {
      setError(null);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: theme.colors.background,
      }}
    >
      {/* Search input */}
      <TextInput
        mode="outlined"
        placeholder="Search by User ID, Language, Theme, or Account Type"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{
          marginBottom: 12,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
          backgroundColor: theme.colors.surface,
        }}
        outlineStyle={{ borderRadius: 12 }}
      />

      {/* Loading spinner */}
      {loading && (
        <View
          style={{
            alignItems: "center",
            marginVertical: 16,
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}

      {/* Setting Table */}
      {!loading && (
        <SettingTable
          settings={paginated}
          onEdit={handleEdit}
          onReset={handleReset}
        />
      )}

      {/* Pagination */}
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Add new FAB */}
      <FAB
        icon="plus"
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
          backgroundColor: theme.colors.primary,
        }}
        color="white"
        onPress={handleAdd}
        label="Add Setting"
        theme={{
          fonts: {
            labelLarge: {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          },
        }}
      />

      {/* Add/Edit Dialog */}
      <SettingDialog
        visible={openDialog}
        setting={selectedSetting}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
      />

      {/* Success/Error Snackbar */}
      <Snackbar
        visible={snackbarVisible || !!error}
        onDismiss={handleSnackbarDismiss}
        duration={4000}
        style={{
          backgroundColor: error ? "#f44336" : "#4caf50",
        }}
      >
        {error || snackbarMessage}
      </Snackbar>
    </View>
  );
}