import * as React from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { FAB, Snackbar, TextInput, useTheme } from "react-native-paper";
import ConsumableTable from "@/features/consumable/ConsumableTable";
import ConsumableDialog from "@/features/consumable/ConsumableDialog";
import { adminConsumableService } from "@/services/admin-consumable.service";
import { IConsumable } from "@/types/consumable";
import PaginationControls from "@/components/paginations/TablePagination";

export default function ConsumableManagement() {
  const theme = useTheme();

  const [consumables, setConsumables] = React.useState<IConsumable[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedConsumable, setSelectedConsumable] =
    React.useState<IConsumable | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Fetch consumables
  const fetchConsumables = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminConsumableService.getAllConsumables();
      if (response.success && Array.isArray(response.data)) {
        setConsumables(response.data);
      } else {
        setError(response.message || "Không thể tải danh sách consumables");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tải danh sách consumables");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchConsumables();
  }, []);

  // Filter + pagination
  const filtered = React.useMemo(() => {
    if (!searchTerm.trim()) return consumables;
    return consumables.filter((c) =>
      c.user_id.toString().includes(searchTerm.trim())
    );
  }, [searchTerm, consumables]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Snackbar
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
    if (error) setError(null);
  };

  // Handlers for add/edit/delete
  const handleAdd = () => {
    setSelectedConsumable(null);
    setOpenDialog(true);
  };

  const handleEdit = (consumable: IConsumable) => {
    setSelectedConsumable(consumable);
    setOpenDialog(true);
  };

  const handleSave = async (consumable: IConsumable) => {
    try {
      setLoading(true);
      let response;

      if (selectedConsumable) {
        // Update existing consumable
        response = await adminConsumableService.updateConsumable(
          selectedConsumable.user_id,
          {
            super_likes_balance: consumable.super_likes_balance,
            boosts_balance: consumable.boosts_balance,
            last_super_like_reset: consumable.last_super_like_reset,
          }
        );

        if (response.success) {
          showSnackbar("Cập nhật consumable thành công!");
        } else {
          showSnackbar(`Lỗi cập nhật: ${response.message}`);
        }
      } else {
        // Create new consumable
        response = await adminConsumableService.createConsumable({
          user_id: consumable.user_id,
          super_likes_balance: consumable.super_likes_balance,
          boosts_balance: consumable.boosts_balance,
          last_super_like_reset: consumable.last_super_like_reset,
        });

        if (response.success) {
          showSnackbar("Tạo consumable mới thành công!");
        } else {
          showSnackbar(`Lỗi tạo mới: ${response.message}`);
        }
      }

      if (response.success) {
        setOpenDialog(false);
        fetchConsumables(); // Refresh data
      }
    } catch (error) {
      console.error("Error saving consumable:", error);
      showSnackbar("Có lỗi xảy ra khi lưu dữ liệu");
    } finally {
      setLoading(false);
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
        placeholder="Search by User ID"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{
          marginBottom: 12,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
          backgroundColor: theme.colors.surface,
        }}
        outlineStyle={{
          borderRadius: 12,
          borderColor: theme.colors.outline,
        }}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />

      {/* Loading spinner */}
      {loading && (
        <View
          style={{
            alignItems: "center",
            marginVertical: 16,
          }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      {/* DataTable */}
      {!loading && (
        <ConsumableTable
          consumables={paginated}
          onEdit={handleEdit}
          onDelete={(c) => {
            console.log("Not implemented");
          }}
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
        label="Add Consumable"
        color={theme.colors.onPrimary}
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
          backgroundColor: theme.colors.primary,
        }}
        theme={{
          fonts: {
            labelLarge: {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          },
        }}
        onPress={handleAdd}
      />

      {/* Dialog */}
      <ConsumableDialog
        visible={openDialog}
        consumable={selectedConsumable}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
      />

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible || !!error}
        onDismiss={handleSnackbarDismiss}
        duration={4000}
        style={{
          backgroundColor: error ? theme.colors.error : theme.colors.secondary,
        }}
      >
        {error || snackbarMessage}
      </Snackbar>
    </View>
  );
}
