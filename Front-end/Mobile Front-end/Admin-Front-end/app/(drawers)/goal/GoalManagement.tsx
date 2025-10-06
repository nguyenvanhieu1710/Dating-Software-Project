import * as React from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { FAB, Snackbar, TextInput, useTheme } from "react-native-paper";
import GoalTable from "@/features/goal/GoalTable";
import GoalDialog from "@/features/goal/GoalDialog";
import { adminGoalService } from "@/services/admin-goal.service";
import { IGoal } from "@/types/goal";
import PaginationControls from "@/components/paginations/TablePagination";

// Custom hooks for data management
const useGoalData = () => {
  const [goals, setGoals] = React.useState<IGoal[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchGoals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminGoalService.getAllGoals();
      if (response.success) {
        setGoals(response.data?.data || []);
      } else {
        setError(response.message || "Không thể tải danh sách goals");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tải danh sách goals");
      console.error("Fetch goals error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    goals,
    setGoals,
    loading,
    setLoading,
    error,
    setError,
    fetchGoals,
  };
};

const useGoalOperations = (
  setGoals: React.Dispatch<React.SetStateAction<IGoal[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const handleCreate = async (goal: IGoal): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminGoalService.createGoal({
        name: goal.name,
        category: goal.category,
      });

      if (response.success) {
        setGoals((prev) => [...prev, response.data!]);
        return true;
      } else {
        setError(response.message || "Không thể tạo goal");
        return false;
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tạo goal");
      console.error("Create goal error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (goal: IGoal): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminGoalService.updateGoal(goal.id, {
        name: goal.name,
        category: goal.category,
      });

      if (response.success) {
        setGoals((prev) =>
          prev.map((g) => (g.id === goal.id ? response.data! : g))
        );
        return true;
      } else {
        setError(response.message || "Không thể cập nhật goal");
        return false;
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi cập nhật goal");
      console.error("Update goal error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (goal: IGoal) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa goal #${goal.id}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            setError(null);
            try {
              const response = await adminGoalService.deleteGoal(goal.id);
              if (response.success) {
                setGoals((prev) => prev.filter((g) => g.id !== goal.id));
              } else {
                setError(response.message || "Không thể xóa goal");
              }
            } catch (err) {
              setError("Đã có lỗi xảy ra khi xóa goal");
              console.error("Delete goal error:", err);
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

export default function GoalManagement() {
  const theme = useTheme();
  const {
    goals,
    setGoals,
    loading,
    setLoading,
    error,
    setError,
    fetchGoals,
  } = useGoalData();

  const { handleCreate, handleUpdate, handleDelete } = useGoalOperations(
    setGoals,
    setLoading,
    setError
  );

  // Dialog state
  const [selectedGoal, setSelectedGoal] = React.useState<IGoal | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Filter
  const filtered = React.useMemo(() => {
    if (!searchTerm.trim()) return goals;
    return adminGoalService.searchGoalsLocally(goals, searchTerm.trim());
  }, [searchTerm, goals]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Load goals on mount
  React.useEffect(() => {
    fetchGoals();
  }, []);

  // Show snackbar for success messages
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // Handler for adding new goal
  const handleAdd = () => {
    setSelectedGoal(null);
    setOpenDialog(true);
  };

  // Handler for editing goal
  const handleEdit = (goal: IGoal) => {
    setSelectedGoal(goal);
    setOpenDialog(true);
  };

  // Handler for saving (create or update)
  const handleSave = async (goal: IGoal) => {
    let success = false;

    if (selectedGoal) {
      success = await handleUpdate(goal);
      if (success) {
        showSnackbar("Cập nhật goal thành công!");
        fetchGoals();
      }
    } else {
      success = await handleCreate(goal);
      if (success) {
        showSnackbar("Tạo goal thành công!");
        fetchGoals();
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

      {/* Goal Table */}
      {!loading && (
        <GoalTable
          goals={paginated}
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
        label="Add Goal"
        theme={{
          fonts: {
            labelLarge: {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          },
        }}
      />

      {/* Add/Edit Dialog */}
      <GoalDialog
        visible={openDialog}
        goal={selectedGoal}
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