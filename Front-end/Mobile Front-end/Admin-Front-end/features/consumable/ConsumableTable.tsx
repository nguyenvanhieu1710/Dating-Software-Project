import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "react-native-paper";
import DataTable from "@/components/tables/DataTable";

import { IConsumable } from "@/types/consumable";
import BalanceChip from "./BalanceChip";
import ResetDateDisplay from "./ResetDateDisplay";
import ConsumableActions from "./ConsumableActions";

type Props = {
  consumables: IConsumable[];
  onEdit: (consumable: IConsumable) => void;
  onDelete: (consumable: IConsumable) => void;
};

export default function ConsumableTable({
  consumables,
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
    userIdText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.primary,
    },
    balanceContainer: {
      flexDirection: "column",
      gap: 4,
      alignItems: "flex-start",
    },
  });

  // Helper function để check có thể reset không
  const canResetToday = (lastReset?: string): boolean => {
    if (!lastReset) return true;
    const resetDate = new Date(lastReset);
    const now = new Date();
    return now.getTime() - resetDate.getTime() > 24 * 60 * 60 * 1000;
  };

  // Transform consumables data to match DataTable requirements (add id field)
  const tableData = React.useMemo(
    () =>
      consumables.map((consumable, index) => ({
        ...consumable,
        id: consumable.user_id || index, // Use user_id as id, fallback to index
      })),
    [consumables]
  );

  const columns = [
    {
      key: "user_id",
      label: "User ID",
      render: (item: IConsumable & { id: number }) => (
        <Text style={styles.userIdText}>#{item.user_id}</Text>
      ),
    },
    {
      key: "super_likes_balance",
      label: "Super Likes",
      render: (item: IConsumable & { id: number }) => (
        <BalanceChip
          value={item.super_likes_balance || 0}
          label="likes"
          type="super-like"
        />
      ),
    },
    {
      key: "boosts_balance",
      label: "Boosts",
      render: (item: IConsumable & { id: number }) => (
        <BalanceChip
          value={item.boosts_balance || 0}
          label="boosts"
          type="boost"
        />
      ),
    },
    {
      key: "last_super_like_reset",
      label: "Last Reset",
      render: (item: IConsumable & { id: number }) => (
        <ResetDateDisplay
          date={item.last_super_like_reset}
          canResetToday={canResetToday(item.last_super_like_reset)}
        />
      ),
    },
    {
      key: "updated_at",
      label: "Updated",
      render: (item: IConsumable & { id: number }) => (
        <Text style={styles.cellText}>
          {item.updated_at
            ? new Date(item.updated_at).toLocaleDateString()
            : "-"}
        </Text>
      ),
    },
  ];

  const renderActions = (consumable: IConsumable & { id: number }) => {
    // Convert back to original IConsumable type for callbacks
    const originalConsumable: IConsumable = {
      user_id: consumable.user_id,
      super_likes_balance: consumable.super_likes_balance,
      boosts_balance: consumable.boosts_balance,
      last_super_like_reset: consumable.last_super_like_reset,
      updated_at: consumable.updated_at,
    };

    return (
      <ConsumableActions
        consumable={originalConsumable}
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
