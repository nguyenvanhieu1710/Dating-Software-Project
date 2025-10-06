import * as React from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { FAB, Snackbar, TextInput, useTheme } from "react-native-paper";
import InterestTable from "@/features/interest/InterestTable";
import InterestDialog from "@/features/interest/InterestDialog";
import { adminInterestService } from "@/services/admin-interest.service";
import { IInterest } from "@/types/interest";
import PaginationControls from "@/components/paginations/TablePagination";

// Custom hooks for data management
const useInterestData = () => {
  const [interests, setInterests] = React.useState<IInterest[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchInterests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminInterestService.getAllInterests();
      if (response.success) {
        setInterests(response.data?.data || []);
      } else {
        setError(response.message || "Không thể tải danh sách interests");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tải danh sách interests");
      console.error("Fetch interests error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    interests,
    setInterests,
    loading,
    setLoading,
    error,
    setError,
    fetchInterests,
  };
};

const useInterestOperations = (
  setInterests: React.Dispatch<React.SetStateAction<IInterest[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const handleCreate = async (interest: IInterest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminInterestService.createInterest({
        name: interest.name,
        category: interest.category,
        is_active: interest.is_active,
      });

      if (response.success) {
        setInterests((prev) => [...prev, response.data!]);
        return true;
      } else {
        setError(response.message || "Không thể tạo interest");
        return false;
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tạo interest");
      console.error("Create interest error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (interest: IInterest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminInterestService.updateInterest(interest.id, {
        name: interest.name,
        category: interest.category,
        is_active: interest.is_active,
      });

      if (response.success) {
        setInterests((prev) =>
          prev.map((i) => (i.id === interest.id ? response.data! : i))
        );
        return true;
      } else {
        setError(response.message || "Không thể cập nhật interest");
        return false;
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi cập nhật interest");
      console.error("Update interest error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (interest: IInterest) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa interest #${interest.id}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            setError(null);
            try {
              const response = await adminInterestService.deleteInterest(interest.id);
              if (response.success) {
                setInterests((prev) => prev.filter((i) => i.id !== interest.id));
              } else {
                setError(response.message || "Không thể xóa interest");
              }
            } catch (err) {
              setError("Đã có lỗi xảy ra khi xóa interest");
              console.error("Delete interest error:", err);
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

export default function InterestManagement() {
  const theme = useTheme();
  const {
    interests,
    setInterests,
    loading,
    setLoading,
    error,
    setError,
    fetchInterests,
  } = useInterestData();

  const { handleCreate, handleUpdate, handleDelete } = useInterestOperations(
    setInterests,
    setLoading,
    setError
  );

  // Dialog state
  const [selectedInterest, setSelectedInterest] = React.useState<IInterest | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Filter
  const filtered = React.useMemo(() => {
    if (!searchTerm.trim()) return interests;
    return adminInterestService.searchInterestsLocally(interests, searchTerm.trim());
  }, [searchTerm, interests]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Load interests on mount
  React.useEffect(() => {
    fetchInterests();
  }, []);

  // Show snackbar for success messages
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // Handler for adding new interest
  const handleAdd = () => {
    setSelectedInterest(null);
    setOpenDialog(true);
  };

  // Handler for editing interest
  const handleEdit = (interest: IInterest) => {
    setSelectedInterest(interest);
    setOpenDialog(true);
  };

  // Handler for saving (create or update)
  const handleSave = async (interest: IInterest) => {
    let success = false;

    if (selectedInterest) {
      success = await handleUpdate(interest);
      if (success) {
        showSnackbar("Cập nhật interest thành công!");
        fetchInterests();
      }
    } else {
      success = await handleCreate(interest);
      if (success) {
        showSnackbar("Tạo interest thành công!");
        fetchInterests();
      }
    }

    if (success) {
      setOpenDialog(false);
    }
  };

  // Clear error when closing snackbar
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
        placeholder="Search by ID or Name"
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

      {/* Interest Table */}
      {!loading && (
        <InterestTable
          interests={paginated}
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
        label="Add Interest"
        theme={{
          fonts: {
            labelLarge: {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          },
        }}
      />

      {/* Add/Edit Dialog */}
      <InterestDialog
        visible={openDialog}
        interest={selectedInterest}
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