import * as React from "react";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import DataTable from "@/components/tables/DataTable";
import { IUserBlock } from "@/types/user-block";
import UserBlockActions from "./UserBlockActions";

type Props = {
  blocks: IUserBlock[];
  onUnblock: (block: IUserBlock) => void;
};

export default function UserBlockTable({ blocks, onUnblock }: Props) {
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

  const tableData = React.useMemo(
    () =>
      blocks.map((block, index) => ({
        ...block,
        id: block.id || index,
      })),
    [blocks]
  );

  const columns = [
    {
      key: "id",
      label: "Block ID",
      render: (item: IUserBlock & { id: number }) => <Text style={styles.idText}>#{item.id}</Text>,
    },
    {
      key: "blocker_id",
      label: "Blocker ID",
      render: (item: IUserBlock & { id: number }) => <Text style={styles.cellText}>{item.blocker_id}</Text>,
    },
    {
      key: "blocked_id",
      label: "Blocked ID",
      render: (item: IUserBlock & { id: number }) => <Text style={styles.cellText}>{item.blocked_id}</Text>,
    },
    {
      key: "created_at",
      label: "Created At",
      render: (item: IUserBlock & { id: number }) => (
        <Text style={styles.cellText}>
          {item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}
        </Text>
      ),
    },
  ];

  const renderActions = (block: IUserBlock & { id: number }) => {
    const originalBlock: IUserBlock = {
      id: block.id,
      blocker_id: block.blocker_id,
      blocked_id: block.blocked_id,
      created_at: block.created_at,
    };
    return <UserBlockActions block={originalBlock} onUnblock={onUnblock} />;
  };

  return <DataTable columns={columns} data={tableData} renderActions={renderActions} />;
}