import * as React from "react";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import DataTable from "@/components/tables/DataTable";
import { IGoal } from "@/types/goal";
import GoalActions from "./GoalActions";

type Props = {
  goals: IGoal[];
  onEdit: (goal: IGoal) => void;
  onDelete: (goal: IGoal) => void;
};

export default function GoalTable({
  goals,
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

  // Transform goals data to match DataTable requirements
  const tableData = React.useMemo(
    () =>
      goals.map((goal, index) => ({
        ...goal,
        id: goal.id || index, // Use id as primary key, fallback to index
      })),
    [goals]
  );

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (item: IGoal & { id: number }) => (
        <Text style={styles.idText}>#{item.id}</Text>
      ),
    },
    {
      key: "name",
      label: "Goal Name",
      render: (item: IGoal & { id: number }) => (
        <Text style={styles.cellText}>{item.name}</Text>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (item: IGoal & { id: number }) => (
        <Text style={styles.cellText}>{item.category || "Uncategorized"}</Text>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      render: (item: IGoal & { id: number }) => (
        <Text style={styles.cellText}>
          {item.created_at
            ? new Date(item.created_at).toLocaleDateString()
            : "-"}
        </Text>
      ),
    },
    {
      key: "updated_at",
      label: "Updated At",
      render: (item: IGoal & { id: number }) => (
        <Text style={styles.cellText}>
          {item.updated_at
            ? new Date(item.updated_at).toLocaleDateString()
            : "-"}
        </Text>
      ),
    },
  ];

  const renderActions = (goal: IGoal & { id: number }) => {
    // Convert back to original IGoal type for callbacks
    const originalGoal: IGoal = {
      id: goal.id,
      name: goal.name,
      category: goal.category,
      created_at: goal.created_at,
      updated_at: goal.updated_at,
    };

    return (
      <GoalActions
        goal={originalGoal}
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