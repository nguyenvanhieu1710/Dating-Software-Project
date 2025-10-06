import * as React from "react";
import { Text, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import DataTable from "@/components/tables/DataTable";
import { ISwipe } from "@/types/swipe";
// import SwipeActions from "./SwipeActions";
import { adminSwipeService } from "@/services/admin-swipe.service";

type Props = {
  swipes: ISwipe[];
  onEdit: (swipe: ISwipe) => void;
  onDelete: (swipe: ISwipe) => void;
};

export default function SwipeTable({ swipes, onEdit, onDelete }: Props) {
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
    actionText: {
      fontSize: 14,
      fontWeight: "500",
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
  });

  const tableData = React.useMemo(
    () =>
      swipes.map((swipe) => ({
        ...adminSwipeService.formatSwipeForDisplay(swipe),
        id: swipe.id, // Ensure id is included as primary key
      })),
    [swipes]
  );

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (item: ISwipe & { id: number }) => (
        <Text style={styles.idText}>#{item.id}</Text>
      ),
    },
    {
      key: "swiper_user_id",
      label: "Swiper User ID",
      render: (item: ISwipe & { id: number }) => (
        <Text style={styles.cellText}>{item.swiper_user_id}</Text>
      ),
    },
    {
      key: "swiped_user_id",
      label: "Swiped User ID",
      render: (item: ISwipe & { id: number }) => (
        <Text style={styles.cellText}>{item.swiped_user_id}</Text>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (item: ISwipe & { id: number; action_display: string }) => (
        <Text
          style={[
            styles.actionText,
            { color: adminSwipeService.getActionColor(item.action) },
          ]}
        >
          {item.action_display}
        </Text>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      render: (
        item: ISwipe & { id: number; created_at_formatted?: string }
      ) => (
        <Text style={styles.cellText}>
          {item.created_at_formatted ||
            new Date(item.created_at).toLocaleDateString()}
        </Text>
      ),
    },
  ];

  const renderActions = (swipe: ISwipe & { id: number }) => {
    const originalSwipe: ISwipe = {
      id: swipe.id,
      swiper_user_id: swipe.swiper_user_id,
      swiped_user_id: swipe.swiped_user_id,
      action: swipe.action,
      created_at: swipe.created_at,
    };

    return (
      <View></View>
      // <SwipeActions swipe={originalSwipe} onEdit={onEdit} onDelete={onDelete} />
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
