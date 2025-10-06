import * as React from "react";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import DataTable from "@/components/tables/DataTable";
import { ISubscription } from "@/types/subscription";
import SubscriptionActions from "./SubscriptionActions";

type Props = {
  subscriptions: ISubscription[];
  onEdit: (subscription: ISubscription) => void;
  onDelete: (subscription: ISubscription) => void;
};

export default function SubscriptionTable({
  subscriptions,
  onEdit,
  onDelete,
}: Props) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    cellText: {
      fontSize: 14,
      color: theme.colors.onSurface,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    idText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.primary,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
  });

  // Transform subscriptions data to match DataTable requirements (add id field if needed)
  const tableData = React.useMemo(
    () =>
      subscriptions.map((subscription, index) => ({
        ...subscription,
        id: subscription.id || index, // Use id as primary key, fallback to index
      })),
    [subscriptions]
  );

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (item: ISubscription & { id: number }) => (
        <Text style={styles.idText}>#{item.id}</Text>
      ),
    },
    {
      key: "user_id",
      label: "User ID",
      render: (item: ISubscription & { id: number }) => (
        <Text style={styles.cellText}>#{item.user_id}</Text>
      ),
    },
    {
      key: "plan_type",
      label: "Plan Type",
      render: (item: ISubscription & { id: number }) => (
        <Text style={styles.cellText}>{item.plan_type}</Text>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: ISubscription & { id: number }) => (
        <Text style={styles.cellText}>{item.status}</Text>
      ),
    },
    {
      key: "start_date",
      label: "Start Date",
      render: (item: ISubscription & { id: number }) => (
        <Text style={styles.cellText}>
          {item.start_date
            ? new Date(item.start_date).toLocaleDateString()
            : "-"}
        </Text>
      ),
    },
    {
      key: "end_date",
      label: "End Date",
      render: (item: ISubscription & { id: number }) => (
        <Text style={styles.cellText}>
          {item.end_date
            ? new Date(item.end_date).toLocaleDateString()
            : "N/A"}
        </Text>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (item: ISubscription & { id: number }) => (
        <Text style={styles.cellText}>
          {item.price} {item.currency}
        </Text>
      ),
    },
  ];

  const renderActions = (subscription: ISubscription & { id: number }) => {
    // Convert back to original ISubscription type for callbacks
    const originalSubscription: ISubscription = {
      id: subscription.id,
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
      cancelled_at: subscription.cancelled_at,
      cancellation_reason: subscription.cancellation_reason,
      refund_status: subscription.refund_status,
      refund_amount: subscription.refund_amount,
      created_at: subscription.created_at,
      updated_at: subscription.updated_at,
    };

    return (
      <SubscriptionActions
        subscription={originalSubscription}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  };

  return (
    <DataTable
      columns={columns}
      data={tableData}
      renderActions={renderActions}
    />
  );
}