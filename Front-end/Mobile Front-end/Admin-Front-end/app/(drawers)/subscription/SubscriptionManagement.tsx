import * as React from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { FAB, Snackbar, TextInput, useTheme } from "react-native-paper";
import SubscriptionTable from "@/features/subscription/SubscriptionTable";
import SubscriptionDialog from "@/features/subscription/SubscriptionDialog";
import { adminSubscriptionService } from "@/services/admin-subscription.service";
import { ISubscription } from "@/types/subscription";
import PaginationControls from "@/components/paginations/TablePagination";

// Custom hooks để tách logic
const useSubscriptionData = () => {
  const [subscriptions, setSubscriptions] = React.useState<ISubscription[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminSubscriptionService.getAllSubscriptions();
      if (response.success) {
        setSubscriptions(response.data);
      } else {
        setError(response.message || "Không thể tải danh sách subscriptions");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tải danh sách subscriptions");
      console.error("Fetch subscriptions error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    subscriptions,
    setSubscriptions,
    loading,
    setLoading,
    error,
    setError,
    fetchSubscriptions,
  };
};

const useSubscriptionOperations = (
  setSubscriptions: React.Dispatch<React.SetStateAction<ISubscription[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const handleCreate = async (
    subscription: ISubscription
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      console.log("create subscription: ", subscription);

      const response = await adminSubscriptionService.createSubscription({
        user_id: subscription.user_id,
        plan_type: subscription.plan_type,
        status: subscription.status,
        billing_cycle: subscription.billing_cycle,
        start_date: subscription.start_date,
        end_date: subscription.end_date,
        next_billing_date: subscription.next_billing_date,
        price: subscription.price,
        currency: subscription.currency,
        payment_method: subscription.payment_method,
        auto_renew: subscription.auto_renew,
        trial_period: subscription.trial_period,
        trial_end_date: subscription.trial_end_date,
        discount_applied: subscription.discount_applied,
        promo_code: subscription.promo_code,
        platform: subscription.platform,
        transaction_id: subscription.transaction_id,
        last_payment_date: subscription.last_payment_date,
        failed_payments: subscription.failed_payments,
        refund_status: subscription.refund_status,
        refund_amount: subscription.refund_amount,
      });

      if (response.success) {
        setSubscriptions((prev) => [...prev, response.data]);
        return true;
      } else {
        setError(response.message || "Không thể tạo subscription");
        return false;
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tạo subscription");
      console.error("Create subscription error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (
    subscription: ISubscription
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      console.log("update subscription: ", subscription);

      const response = await adminSubscriptionService.updateSubscription(
        subscription.id,
        {
          plan_type: subscription.plan_type,
          status: subscription.status,
          billing_cycle: subscription.billing_cycle,
          start_date: subscription.start_date,
          end_date: subscription.end_date,
          next_billing_date: subscription.next_billing_date,
          price: subscription.price,
          currency: subscription.currency,
          payment_method: subscription.payment_method,
          auto_renew: subscription.auto_renew,
          trial_period: subscription.trial_period,
          trial_end_date: subscription.trial_end_date,
          discount_applied: subscription.discount_applied,
          promo_code: subscription.promo_code,
          platform: subscription.platform,
          transaction_id: subscription.transaction_id,
          last_payment_date: subscription.last_payment_date,
          failed_payments: subscription.failed_payments,
          cancelled_at: subscription.cancelled_at,
          cancellation_reason: subscription.cancellation_reason,
          refund_status: subscription.refund_status,
          refund_amount: subscription.refund_amount,
        }
      );

      if (response.success) {
        setSubscriptions((prev) =>
          prev.map((s) => (s.id === subscription.id ? response.data : s))
        );
        return true;
      } else {
        setError(response.message || "Không thể cập nhật subscription");
        return false;
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi cập nhật subscription");
      console.error("Update subscription error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subscription: ISubscription) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa subscription #${subscription.id}?`,
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
                await adminSubscriptionService.cancelSubscription(
                  subscription.id,
                  subscription.user_id
                );
              if (response.success) {
                setSubscriptions((prev) =>
                  prev.filter((s) => s.id !== subscription.id)
                );
              } else {
                setError(response.message || "Không thể xóa subscription");
              }
            } catch (err) {
              setError("Đã có lỗi xảy ra khi xóa subscription");
              console.error("Delete subscription error:", err);
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

export default function SubscriptionManagement() {
  const theme = useTheme();
  const {
    subscriptions,
    setSubscriptions,
    loading,
    setLoading,
    error,
    setError,
    fetchSubscriptions,
  } = useSubscriptionData();

  const { handleCreate, handleUpdate, handleDelete } =
    useSubscriptionOperations(setSubscriptions, setLoading, setError);

  // Dialog state
  const [selectedSubscription, setSelectedSubscription] =
    React.useState<ISubscription | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Filter
  const filtered = React.useMemo(() => {
    if (!searchTerm.trim()) return subscriptions;
    return subscriptions.filter(
      (s) =>
        s.id.toString().includes(searchTerm.trim()) ||
        s.user_id.toString().includes(searchTerm.trim())
    );
  }, [searchTerm, subscriptions]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Load subscriptions on mount
  React.useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Show snackbar for success messages
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // Handler thêm mới
  const handleAdd = () => {
    setSelectedSubscription(null);
    setOpenDialog(true);
  };

  // Handler sửa
  const handleEdit = (subscription: ISubscription) => {
    setSelectedSubscription(subscription);
    setOpenDialog(true);
  };

  // Handler lưu (thêm mới hoặc cập nhật)
  const handleSave = async (subscription: ISubscription) => {
    let success = false;

    if (selectedSubscription) {
      success = await handleUpdate(subscription);
      if (success) {
        showSnackbar("Cập nhật subscription thành công!");
        fetchSubscriptions();
      }
    } else {
      success = await handleCreate(subscription);
      if (success) {
        showSnackbar("Tạo subscription thành công!");
        fetchSubscriptions();
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
        placeholder="Search by ID or User ID"
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

      {/* Subscription Table */}
      {!loading && (
        <SubscriptionTable
          subscriptions={paginated}
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
        label="Add Subscription"
        theme={{
          fonts: {
            labelLarge: {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          },
        }}
      />

      {/* Add/Edit Dialog */}
      <SubscriptionDialog
        visible={openDialog}
        subscription={selectedSubscription}
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
