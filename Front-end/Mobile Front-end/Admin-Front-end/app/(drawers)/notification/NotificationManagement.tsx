import * as React from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { FAB, Snackbar, TextInput, useTheme } from "react-native-paper";
import NotificationTable from "@/features/notification/NotificationTable";
import NotificationDialog from "@/features/notification/NotificationDialog";
import PaginationControls from "@/components/paginations/TablePagination";
import { adminUserService } from "@/services/admin-user.service";
import { IAdminUser } from "@/types/admin-user";
import { adminNotificationService } from "@/services/admin-notification.service";
import { INotification, NotificationQueryParams } from "@/types/notification";
import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom hook để quản lý dữ liệu notification
const useNotificationData = () => {
  const [notifications, setNotifications] = React.useState<INotification[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [totalPages, setTotalPages] = React.useState(1);

  const fetchNotifications = async (params: NotificationQueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminNotificationService.getAllNotifications();
      // console.log("response of getAllNotifications: ", response);
      if (response.success && Array.isArray(response.data)) {
        setNotifications(response.data);
        const totalRecords = response.data.length || 0;
        const calculatedTotalPages = Math.ceil(totalRecords / 5);
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
      } else {
        setError(response.message || "No notifications found");
      }
    } catch (err) {
      setError("Failed to fetch notifications");
      console.error("Fetch notifications error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    notifications,
    setNotifications,
    loading,
    setLoading,
    error,
    setError,
    fetchNotifications,
    totalPages,
  };
};

// Custom hook để xử lý các thao tác CRUD cho notification
const useNotificationOperations = (
  setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const handleCreate = async (notificationData: {
    user_id: number;
    title: string;
    body: string;
    data?: Record<string, any>;
    sent_at?: Date;
    read_at?: Date;
    created_at?: Date;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminNotificationService.createNotification(
        notificationData
      );
      // console.log("response of create: ", response);
      if (response.success && response.data) {
        return true;
      } else {
        setError(response.message || "Failed to create notification");
        return false;
      }
    } catch (err) {
      setError("Failed to create notification");
      console.error("Create notification error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (
    notification: INotification
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updateData = {
        title: notification.title,
        body: notification.body,
        data: notification.data,
      };
      // Can not update notification
      return false;
    } catch (err) {
      setError("Failed to update notification");
      console.error("Update notification error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notification: INotification) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa notification #${notification.id}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            setError(null);
            try {
              const response =
                await adminNotificationService.deleteNotification(
                  notification.id
                );
              if (response.success) {
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notification.id)
                );
              } else {
                setError(response.message || "Failed to delete notification");
              }
            } catch (err) {
              setError("Failed to delete notification");
              console.error("Delete notification error:", err);
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
    handleDelete,
  };
};

export default function NotificationManagement() {
  const theme = useTheme();
  const {
    notifications,
    setNotifications,
    loading,
    setLoading,
    error,
    setError,
    fetchNotifications,
    totalPages,
  } = useNotificationData();
  const [users, setUsers] = React.useState<IAdminUser[]>([]);
  const [currentUserId, setCurrentUserId] = React.useState<number>(0);
  const socketRef = React.useRef<Socket | null>(null);

  React.useEffect(() => {
    const loadCurrentUser = async () => {
      const userJson = await AsyncStorage.getItem("user_data");
      // console.log("userJson: ", userJson);
      if (userJson) {
        const user = JSON.parse(userJson);
        setCurrentUserId(user.id);
      }
    };
    loadCurrentUser();
    const loadUsers = async () => {
      const response = await adminUserService.getAllUsers();
      console.log("response of getAllUsers: ", response);
      if (response.success && Array.isArray(response.data)) {
        setUsers(response.data);
      }
    };
    loadUsers();
  }, []);

  React.useEffect(() => {
    console.log(
      "NotificationManagement rendered at:",
      new Date().toISOString()
    );
    const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
      query: { userId: currentUserId.toString() },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // ==================== CONNECTION ====================
    socket.on("connect", () => {
      console.log("✅ Notification socket connected:", socket.id);
      socket.emit("join-room", { room: `user_${currentUserId}` });
    });

    // ==================== RECEIVE NOTIFICATION ====================
    socket.on("receive-notification", (notification: INotification) => {
      console.log("📢 Received global notification:", notification);

      setNotifications((prev) => {
        // Kiểm tra duplicate
        const isDuplicate = prev.some(
          (existingNotif) => existingNotif.id === notification.id
        );

        if (isDuplicate) {
          console.log("⚠️ Duplicate notification detected, skipping");
          return prev;
        }

        // Thêm notification mới vào đầu danh sách
        return [notification, ...prev];
      });
    });

    // ==================== NOTIFICATION SENT (ADMIN) ====================
    socket.on("notification-sent", (notification: Notification) => {
      console.log("✅ Admin notification sent successfully:", notification);
    });

    // ==================== ERROR HANDLERS ====================
    socket.on("connect_error", (err) => {
      console.error("❌ Notification socket connection error:", err.message);
    });

    socket.on("error", (err: { message: string }) => {
      console.error("❌ Notification socket server error:", err);
    });

    // ==================== CLEANUP ====================
    return () => {
      console.log("🔔 Cleaning up notification socket...");
      socket.off("connect");
      socket.off("receive-notification");
      socket.off("notification-sent");
      socket.off("connect_error");
      socket.off("error");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUserId, process.env.EXPO_PUBLIC_SOCKET_URL]);

  // ==================== SEND NOTIFICATION (ADMIN) ====================
  const sendGlobalNotification = (notificationData: INotification) => {
    if (!socketRef.current) {
      console.error("❌ Notification socket is not connected");
      return;
    }

    const { user_id, title, body, data, sent_at, read_at, created_at } =
      notificationData;

    if (!title || !body) {
      console.error("❌ Notification title and body are required");
      return;
    }

    socketRef.current.emit("send-global-notification", {
      user_id,
      title,
      body,
      data,
      sent_at,
      read_at,
      created_at,
    });

    console.log("📤 Sending global notification:", notificationData);
  };

  const { handleCreate, handleUpdate, handleDelete } =
    useNotificationOperations(setNotifications, setLoading, setError);

  // Dialog state
  const [selectedNotification, setSelectedNotification] =
    React.useState<INotification | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Filter
  const filtered = React.useMemo(() => {
    if (!searchTerm.trim()) return notifications || [];
    return (
      adminNotificationService.searchNotificationsLocally(
        notifications || [],
        searchTerm.trim()
      ) || []
    );
  }, [searchTerm, notifications]);

  // Pagination
  const paginated = React.useMemo(() => {
    if (!filtered || !Array.isArray(filtered)) return [];
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Load notifications on mount and on page change
  React.useEffect(() => {
    fetchNotifications({ page, limit: pageSize });
  }, [page]);

  // Show snackbar for success messages
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // Handler thêm mới
  const handleAdd = () => {
    setSelectedNotification(null);
    setOpenDialog(true);
  };

  // Handler sửa
  const handleEdit = (notification: INotification) => {
    setSelectedNotification(notification);
    setOpenDialog(true);
  };

  // Handler lưu (thêm mới hoặc cập nhật)
  const handleSave = async (notificationData: {
    user_id: number;
    title: string;
    body: string;
    data?: Record<string, any>;
    sent_at?: Date;
    read_at?: Date;
    created_at?: Date;
  }) => {
    let success = false;

    if (selectedNotification) {
      const updatedNotification: INotification = {
        ...selectedNotification,
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data,
      };
      success = await handleUpdate(updatedNotification);
      if (success) {
        showSnackbar("Updated notification successfully!");
        fetchNotifications({ page, limit: pageSize });
      }
    } else {
      success = await handleCreate(notificationData);
      if (success) {
        showSnackbar("Created notification successfully!");
        // Gửi notification real-time qua socket
        sendGlobalNotification({
          id: Date.now(), // temporary ID
          user_id: notificationData.user_id,
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data,
          sent_at: notificationData.sent_at?.toDateString(),
          read_at: notificationData.read_at?.toDateString(),
          created_at: notificationData.created_at?.toDateString(),
        });

        fetchNotifications({ page, limit: pageSize });
      }
    }

    if (success) {
      setOpenDialog(false);
    }
  };

  // ==================== SEND TO ALL USERS ====================
  const [sendAllDialogVisible, setSendAllDialogVisible] = React.useState(false);
  const [globalTitle, setGlobalTitle] = React.useState("");
  const [globalBody, setGlobalBody] = React.useState("");

  // Hàm gửi tới tất cả user
  const sendGlobalNotificationToAll = async () => {
    if (!globalTitle.trim() || !globalBody.trim()) {
      showSnackbar("Please enter both title and body");
      return;
    }

    if (!users || users.length === 0) {
      showSnackbar("No users found to send notifications");
      return;
    }

    setLoading(true);
    try {
      console.log("🚀 Sending global notification to all users:", users);
      for (const user of users) {
        await adminNotificationService.createNotification({
          user_id: Number(user.id),
          title: globalTitle.trim(),
          body: globalBody.trim(),
          data: {},
        });

        sendGlobalNotification({
          id: Date.now() + Math.random(),
          user_id: Number(user.id),
          title: globalTitle.trim(),
          body: globalBody.trim(),
          data: {},
          created_at: new Date().toISOString(),
        });
      }

      showSnackbar(`Sent notification to ${users.length} users`);
      setSendAllDialogVisible(false);
      setGlobalTitle("");
      setGlobalBody("");
      fetchNotifications({ page, limit: pageSize });
    } catch (err) {
      console.error("Send to all users error:", err);
      showSnackbar("Failed to send to all users");
    } finally {
      setLoading(false);
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
        placeholder="Search by Title, Body, or Type"
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

      {/* Notification Table */}
      {!loading && (
        <NotificationTable
          notifications={paginated}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <FAB
        icon="send"
        label="Send notification to all users"
        style={{
          position: "absolute",
          left: 16,
          bottom: 16,
          alignSelf: "flex-start",
          backgroundColor: theme.colors.secondary,
        }}
        color="white"
        theme={{
          fonts: {
            labelLarge: {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          },
        }}
        onPress={() => {
          setSendAllDialogVisible(true);
        }}
      />

      {/* Send to all users dialog */}
      <NotificationDialog
        visible={sendAllDialogVisible}
        onClose={() => setSendAllDialogVisible(false)}
        onSave={(notificationData) => {
          setGlobalTitle(notificationData.title);
          setGlobalBody(notificationData.body);
          sendGlobalNotificationToAll();
        }}
        notification={null}
        isGlobal
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
        label="Add Notification"
        theme={{
          fonts: {
            labelLarge: {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          },
        }}
      />

      {/* Add/Edit Dialog */}
      <NotificationDialog
        visible={openDialog}
        notification={selectedNotification}
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
