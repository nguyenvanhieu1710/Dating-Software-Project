import * as React from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { FAB, Snackbar, TextInput, useTheme } from "react-native-paper";
import ModerationTable from "@/features/moderation-report/ModerationTable";
import ModerationDialog from "@/features/moderation-report/ModerationDialog";
import { adminModerationService } from "@/services/admin-moderation.service";
import {
  IModerationReport,
  ReportQueryParams,
} from "@/types/moderation-report";
import PaginationControls from "@/components/paginations/TablePagination";

// Custom hook để quản lý dữ liệu report
const useReportData = () => {
  const [reports, setReports] = React.useState<IModerationReport[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [totalPages, setTotalPages] = React.useState(1);

  const fetchReports = async (params: ReportQueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminModerationService.getAllReports(params);
      if (
        response.success &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        setReports(response.data.data);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages || 1);
        }
      } else {
        setError(response.message || "Không thể tải danh sách reports");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tải danh sách reports");
      console.error("Fetch reports error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    reports,
    setReports,
    loading,
    setLoading,
    error,
    setError,
    fetchReports,
    totalPages,
  };
};

// Custom hook để xử lý các thao tác CRUD cho report
const useReportOperations = (
  setReports: React.Dispatch<React.SetStateAction<IModerationReport[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const handleCreate = async (reportData: {
    reporter_id: number;
    reported_user_id: number;
    reported_content_id?: number;
    content_type: string;
    reason: string;
    description?: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminModerationService.createReport(reportData);
      if (response.success) {
        setReports((prev) => (response.data ? [...prev, response.data] : prev));
        return true;
      } else {
        setError(response.message || "Không thể tạo report");
        return false;
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tạo report");
      console.error("Create report error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (report: IModerationReport): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updateData = {
        status: report.status,
        priority: report.priority,
        admin_notes: report.admin_notes,
        resolved_by: report.resolved_by,
      };
      const response = await adminModerationService.updateReport(
        report.id,
        updateData
      );
      if (response.success) {
        setReports((prev) =>
          prev.map((r) => (r.id === report.id ? response.data || r : r))
        );
        return true;
      } else {
        setError(response.message || "Không thể cập nhật report");
        return false;
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi cập nhật report");
      console.error("Update report error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (report: IModerationReport) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa report #${report.id}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            setError(null);
            try {
              const response = await adminModerationService.deleteReport(
                report.id
              );
              if (response.success) {
                setReports((prev) => prev.filter((r) => r.id !== report.id));
              } else {
                setError(response.message || "Không thể xóa report");
              }
            } catch (err) {
              setError("Đã có lỗi xảy ra khi xóa report");
              console.error("Delete report error:", err);
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

export default function ModerationManagement() {
  const theme = useTheme();
  const {
    reports,
    setReports,
    loading,
    setLoading,
    error,
    setError,
    fetchReports,
    totalPages,
  } = useReportData();

  const { handleCreate, handleUpdate, handleDelete } = useReportOperations(
    setReports,
    setLoading,
    setError
  );

  // Dialog state
  const [selectedReport, setSelectedReport] =
    React.useState<IModerationReport | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Filter
  const filtered = React.useMemo(() => {
    if (!searchTerm.trim()) return reports;
    return adminModerationService.searchReportsLocally(
      reports,
      searchTerm.trim()
    );
  }, [searchTerm, reports]);

  // Pagination
  const paginated = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Load reports on mount and on page change
  React.useEffect(() => {
    fetchReports({ page, limit: pageSize });
  }, [page]);

  // Show snackbar for success messages
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // Handler thêm mới
  const handleAdd = () => {
    setSelectedReport(null);
    setOpenDialog(true);
  };

  // Handler sửa
  const handleEdit = (report: IModerationReport) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  // Handler lưu (thêm mới hoặc cập nhật)
  const handleSave = async (reportData: {
    reporter_id: number;
    reported_user_id: number;
    reported_content_id?: number;
    content_type: string;
    reason: string;
    description?: string;
    status?: string;
    priority?: string;
    admin_notes?: string;
    resolved_by?: number;
  }) => {
    let success = false;

    if (selectedReport) {
      const updatedReport: IModerationReport = {
        ...selectedReport,
        status: reportData.status || selectedReport.status,
        priority: reportData.priority || selectedReport.priority,
        admin_notes: reportData.admin_notes || selectedReport.admin_notes,
        resolved_by: reportData.resolved_by || selectedReport.resolved_by,
      };
      success = await handleUpdate(updatedReport);
      if (success) {
        showSnackbar("Cập nhật report thành công!");
      }
    } else {
      success = await handleCreate(reportData);
      if (success) {
        showSnackbar("Tạo report thành công!");
      }
    }

    if (success) {
      fetchReports({ page, limit: pageSize });
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
        placeholder="Search by ID, Reason, or Content Type"
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

      {/* Moderation Table */}
      {!loading && (
        <ModerationTable
          reports={paginated}
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
        label="Add Report"
        theme={{
          fonts: {
            labelLarge: {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          },
        }}
      />

      {/* Add/Edit Dialog */}
      <ModerationDialog
        visible={openDialog}
        report={selectedReport}
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
