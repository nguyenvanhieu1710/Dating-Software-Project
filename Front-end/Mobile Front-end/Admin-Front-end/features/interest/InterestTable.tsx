import * as React from "react";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import DataTable from "@/components/tables/DataTable";
import { IInterest } from "@/types/interest";
import InterestActions from "./InterestActions";

type Props = {
  interests: IInterest[];
  onEdit: (interest: IInterest) => void;
  onDelete: (interest: IInterest) => void;
};

export default function InterestTable({
  interests,
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

  // Transform interests data to match DataTable requirements
  const tableData = React.useMemo(
    () =>
      interests.map((interest, index) => ({
        ...interest,
        id: interest.id || index, // Use id as primary key, fallback to index
      })),
    [interests]
  );

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (item: IInterest & { id: number }) => (
        <Text style={styles.idText}>#{item.id}</Text>
      ),
    },
    {
      key: "name",
      label: "Interest Name",
      render: (item: IInterest & { id: number }) => (
        <Text style={styles.cellText}>{item.name}</Text>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (item: IInterest & { id: number }) => (
        <Text style={styles.cellText}>{item.category || "Uncategorized"}</Text>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (item: IInterest & { id: number }) => (
        <Text style={styles.cellText}>{item.is_active ? "Active" : "Inactive"}</Text>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      render: (item: IInterest & { id: number }) => (
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
      render: (item: IInterest & { id: number }) => (
        <Text style={styles.cellText}>
          {item.updated_at
            ? new Date(item.updated_at).toLocaleDateString()
            : "-"}
        </Text>
      ),
    },
  ];

  const renderActions = (interest: IInterest & { id: number }) => {
    // Convert back to original IInterest type for callbacks
    const originalInterest: IInterest = {
      id: interest.id,
      name: interest.name,
      category: interest.category,
      is_active: interest.is_active,
      created_at: interest.created_at,
      updated_at: interest.updated_at,
    };

    return (
      <InterestActions
        interest={originalInterest}
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