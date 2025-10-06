import * as React from "react";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import DataTable from "@/components/tables/DataTable";
import { INotification } from "@/types/notification";
import NotificationActions from "./NotificationActions";
import { adminNotificationService } from "@/services/admin-notification.service";

type Props = {
  notifications: INotification[];
  onEdit: (notification: INotification) => void;
  onDelete: (notification: INotification) => void;
};

export default function NotificationTable({ notifications, onEdit, onDelete }: Props) {
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
    statusText: {
      fontSize: 14,
      fontWeight: "500",
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
  });

  const tableData = React.useMemo(
    () =>
      notifications.map((notification) => ({
        ...adminNotificationService.formatNotificationForDisplay(notification),
        id: notification.id,
      })),
    [notifications]
  );

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (item: INotification & { id: number }) => (
        <Text style={styles.idText}>#{item.id}</Text>
      ),
    },
    {
      key: "user_id",
      label: "User ID",
      render: (item: INotification & { id: number }) => (
        <Text style={styles.cellText}>{item.user_id}</Text>
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (item: INotification & { id: number }) => (
        <Text style={styles.cellText}>{item.title}</Text>
      ),
    },
    {
      key: "body",
      label: "Body",
      render: (item: INotification & { id: number }) => (
        <Text style={styles.cellText}>{item.body.substring(0, 50) + "..."}</Text>
      ),
    },
    {
      key: "sent_at",
      label: "Sent At",
      render: (item: INotification & { id: number; sent_at_formatted?: string }) => (
        <Text style={styles.cellText}>
          {item.sent_at_formatted || new Date(item.sent_at).toLocaleDateString()}
        </Text>
      ),
    },
    {
      key: "read_at",
      label: "Read At",
      render: (item: INotification & { id: number; read_at_formatted?: string }) => (
        <Text style={styles.cellText}>
          {item.read_at_formatted || new Date(item.read_at || "").toLocaleDateString()}
        </Text>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      render: (item: INotification & { id: number; created_at_formatted?: string }) => (
        <Text style={styles.cellText}>
          {item.created_at_formatted || new Date(item.created_at).toLocaleDateString()}
        </Text>
      ),
    },
  ];

  const renderActions = (notification: INotification & { id: number }) => {
    const originalNotification: INotification = {
      id: notification.id,
      user_id: notification.user_id,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      sent_at: notification.sent_at,
      read_at: notification.read_at,
      created_at: notification.created_at,
    };

    return (
      <NotificationActions
        notification={originalNotification}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  };

  return (
    <DataTable columns={columns} data={tableData} renderActions={renderActions} />
  );
}