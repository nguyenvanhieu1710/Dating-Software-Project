import * as React from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { FAB, Snackbar, TextInput, useTheme } from "react-native-paper";
import SwipeTable from "@/features/swipe/SwipeTable";
import SwipeDialog from "@/features/swipe/SwipeDialog";
import { adminSwipeService } from "@/services/admin-swipe.service";
import { ISwipe, SwipeQueryParams } from "@/types/swipe";
import PaginationControls from "@/components/paginations/TablePagination";

// Custom hook để quản lý dữ liệu swipe
const useSwipeData = () => {
  const [swipes, setSwipes] = React.useState<ISwipe[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [totalPages, setTotalPages] = React.useState(1);

  const fetchSwipes = async (params: SwipeQueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminSwipeService.getAllSwipes(params);
      if (response.success) {
        setSwipes(response.data);
        setTotalPages(response.pagination.totalPages);
      } else {
        setError(response.message || "Không thể tải danh sách swipes");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tải danh sách swipes");
      console.error("Fetch swipes error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    swipes,
    setSwipes,
    loading,
    setLoading,
    error,
    setError,
    fetchSwipes,
    totalPages,
  };
};

// Custom hook để xử lý các thao tác CRUD cho swipe
const useSwipeOperations = (
  setSwipes: React.Dispatch<React.SetStateAction<ISwipe[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const handleCreate = async (swipeData: {
    swiper_user_id: number;
    swiped_user_id: number;
    action: "like" | "pass" | "superlike";
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminSwipeService.performSwipe(swipeData);
      if (response.success) {
        setSwipes((prev) => [...prev, response.data.swipe]);
        return true;
      } else {
        setError(response.message || "Không thể tạo swipe");
        return false;
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tạo swipe");
      console.error("Create swipe error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (swipe: ISwipe): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminSwipeService.performSwipe({
        swiper_user_id: swipe.swiper_user_id,
        swiped_user_id: swipe.swiped_user_id,
        action: swipe.action as "like" | "pass" | "superlike",
      });
      if (response.success) {
        setSwipes((prev) =>
          prev.map((s) => (s.id === swipe.id ? response.data.swipe : s))
        );
        return true;
      } else {
        setError(response.message || "Không thể cập nhật swipe");
        return false;
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi cập nhật swipe");
      console.error("Update swipe error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (swipe: ISwipe) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa swipe #${swipe.id}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            setError(null);
            try {
              const response = await adminSwipeService.undoSwipe(
                swipe.swiper_user_id,
                swipe.swiped_user_id
              );
              if (response.success) {
                setSwipes((prev) => prev.filter((s) => s.id !== swipe.id));
              } else {
                setError(response.message || "Không thể xóa swipe");
              }
            } catch (err) {
              setError("Đã có lỗi xảy ra khi xóa swipe");
              console.error("Delete swipe error:", err);
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

export default function SwipeManagement() {
  const theme = useTheme();
  const {
    swipes,
    setSwipes,
    loading,
    setLoading,
    error,
    setError,
    fetchSwipes,
    totalPages,
  } = useSwipeData();

  const { handleCreate, handleUpdate, handleDelete } = useSwipeOperations(
    setSwipes,
    setLoading,
    setError
  );

  // Dialog state
  const [selectedSwipe, setSelectedSwipe] = React.useState<ISwipe | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Filter
  const filtered = React.useMemo(() => {
    if (!searchTerm.trim()) return swipes;
    return swipes.filter(
      (s) =>
        s.id.toString().includes(searchTerm.trim()) ||
        s.swiper_user_id.toString().includes(searchTerm.trim()) ||
        s.swiped_user_id.toString().includes(searchTerm.trim()) ||
        adminSwipeService.getActionDisplayName(s.action).toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [searchTerm, swipes]);

  // Pagination
  const paginated = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Load swipes on mount
  React.useEffect(() => {
    fetchSwipes({ page, limit: pageSize });
  }, [page]);

  // Show snackbar for success messages
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // Handler thêm mới
  const handleAdd = () => {
    setSelectedSwipe(null);
    setOpenDialog(true);
  };

  // Handler sửa
  const handleEdit = (swipe: ISwipe) => {
    setSelectedSwipe(swipe);
    setOpenDialog(true);
  };

  // Handler lưu (thêm mới hoặc cập nhật)
  const handleSave = async (swipeData: {
    swiper_user_id: number;
    swiped_user_id: number;
    action: "like" | "pass" | "superlike";
  }) => {
    let success = false;

    if (selectedSwipe) {
      const updatedSwipe: ISwipe = {
        ...selectedSwipe,
        swiper_user_id: swipeData.swiper_user_id,
        swiped_user_id: swipeData.swiped_user_id,
        action: swipeData.action,
      };
      success = await handleUpdate(updatedSwipe);
      if (success) {
        showSnackbar("Cập nhật swipe thành công!");
        fetchSwipes({ page, limit: pageSize });
      }
    } else {
      success = await handleCreate(swipeData);
      if (success) {
        showSnackbar("Tạo swipe thành công!");
        fetchSwipes({ page, limit: pageSize });
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
        placeholder="Search by ID, Swiper User ID, Swiped User ID, or Action"
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

      {/* Swipe Table */}
      {!loading && (
        <SwipeTable
          swipes={paginated}
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
      {/* <FAB
        icon="plus"
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
          backgroundColor: theme.colors.primary,
        }}
        color="white"
        onPress={handleAdd}
        label="Add Swipe"
        theme={{
          fonts: {
            labelLarge: {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          },
        }}
      /> */}

      {/* Add/Edit Dialog */}
      <SwipeDialog
        visible={openDialog}
        swipe={selectedSwipe}
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