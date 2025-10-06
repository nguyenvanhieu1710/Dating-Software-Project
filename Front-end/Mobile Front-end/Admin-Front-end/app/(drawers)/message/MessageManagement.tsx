import * as React from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { FAB, Snackbar, TextInput, useTheme } from "react-native-paper";
import MessageTable from "@/features/message/MessageTable";
import MessageDialog from "@/features/message/MessageDialog";
import { adminMessageService } from "@/services/admin-message.service";
import { IMessage } from "@/types/message";
import PaginationControls from "@/components/paginations/TablePagination";

// Custom hooks để tách logic
const useMessageData = () => {
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminMessageService.getAllMessages();
      if (response.success) {
        setMessages(response.data);
      } else {
        setError(response.message || "Không thể tải danh sách messages");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tải danh sách messages");
      console.error("Fetch messages error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    loading,
    setLoading,
    error,
    setError,
    fetchMessages,
  };
};

const useMessageOperations = (
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const handleCreate = async (message: IMessage): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminMessageService.createMessage({
        match_id: message.match_id,
        content: message.content,
        message_type: message.message_type as any,
        reply_to_message_id: message.reply_to_message_id || undefined,
      });

      if (response.success) {
        setMessages((prev) => [...prev, response.data]);
        return true;
      } else {
        setError(response.message || "Không thể tạo message");
        return false;
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tạo message");
      console.error("Create message error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (message: IMessage): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminMessageService.updateMessage(message.id, {
        content: message.content,
        message_type: message.message_type as any,
      });

      if (response.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? response.data : m))
        );
        return true;
      } else {
        setError(response.message || "Không thể cập nhật message");
        return false;
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi cập nhật message");
      console.error("Update message error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (message: IMessage) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa message #${message.id}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            setError(null);
            try {
              const response = await adminMessageService.deleteMessage(
                message.id
              );
              if (response.success) {
                setMessages((prev) => prev.filter((m) => m.id !== message.id));
              } else {
                setError(response.message || "Không thể xóa message");
              }
            } catch (err) {
              setError("Đã có lỗi xảy ra khi xóa message");
              console.error("Delete message error:", err);
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

export default function MessageManagement() {
  const theme = useTheme();
  const {
    messages,
    setMessages,
    loading,
    setLoading,
    error,
    setError,
    fetchMessages,
  } = useMessageData();

  const { handleCreate, handleUpdate, handleDelete } = useMessageOperations(
    setMessages,
    setLoading,
    setError
  );

  // Dialog state
  const [selectedMessage, setSelectedMessage] = React.useState<IMessage | null>(
    null
  );
  const [openDialog, setOpenDialog] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Filter
  const filtered = React.useMemo(() => {
    if (!searchTerm.trim()) return messages;
    return messages.filter(
      (m) =>
        m.id.toString().includes(searchTerm.trim()) ||
        m.match_id.toString().includes(searchTerm.trim()) ||
        m.sender_id.toString().includes(searchTerm.trim()) ||
        m.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, messages]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Load messages on mount
  React.useEffect(() => {
    fetchMessages();
  }, []);

  // Show snackbar for success messages
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // Handler thêm mới
  const handleAdd = () => {
    setSelectedMessage(null);
    setOpenDialog(true);
  };

  // Handler sửa
  const handleEdit = (message: IMessage) => {
    setSelectedMessage(message);
    setOpenDialog(true);
  };

  // Handler lưu (thêm mới hoặc cập nhật)
  const handleSave = async (message: IMessage) => {
    let success = false;

    if (selectedMessage) {
      success = await handleUpdate({ ...selectedMessage, ...message });
      if (success) {
        showSnackbar("Cập nhật message thành công!");
        fetchMessages();
      }
    } else {
      success = await handleCreate(message);
      if (success) {
        showSnackbar("Tạo message thành công!");
        fetchMessages();
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
        placeholder="Search by ID, Match ID, Sender ID, or Content"
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

      {/* Message Table */}
      {!loading && (
        <MessageTable
          messages={paginated}
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
        label="Add Message"
        theme={{
          fonts: {
            labelLarge: {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          },
        }}
      />

      {/* Add/Edit Dialog */}
      <MessageDialog
        visible={openDialog}
        message={selectedMessage}
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
