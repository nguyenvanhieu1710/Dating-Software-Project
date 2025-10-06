import * as React from "react";
import { Text, StyleSheet, View } from "react-native";
import { useTheme, Chip } from "react-native-paper";
import DataTable from "@/components/tables/DataTable";
import { IMessage } from "@/types/message";
import MessageActions from "./MessageActions";
import { adminMessageService } from "@/services/admin-message.service";

type Props = {
  messages: IMessage[];
  onEdit: (message: IMessage) => void;
  onDelete: (message: IMessage) => void;
};

export default function MessageTable({ messages, onEdit, onDelete }: Props) {
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
    contentText: {
      fontSize: 14,
      color: theme.colors.onSurface,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
      maxWidth: 200,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: 12,
    },
    readBadge: {
      backgroundColor: theme.colors.primary + "20",
      color: theme.colors.primary,
    },
    unreadBadge: {
      backgroundColor: theme.colors.tertiary + "20",
      color: theme.colors.tertiary,
    },
    pinnedBadge: {
      backgroundColor: theme.colors.secondary + "20",
      color: theme.colors.secondary,
    },
  });

  // Transform messages data to match DataTable requirements
  const tableData = React.useMemo(
    () =>
      messages.map((message, index) => ({
        ...message,
        id: message.id || index,
      })),
    [messages]
  );

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (item: IMessage & { id: number }) => (
        <Text style={styles.idText}>#{item.id}</Text>
      ),
    },
    {
      key: "match_id",
      label: "Match ID",
      render: (item: IMessage & { id: number }) => (
        <Text style={styles.cellText}>#{item.match_id}</Text>
      ),
    },
    {
      key: "sender_id",
      label: "Sender ID",
      render: (item: IMessage & { id: number }) => (
        <Text style={styles.cellText}>#{item.sender_id}</Text>
      ),
    },
    {
      key: "content",
      label: "Content",
      render: (item: IMessage & { id: number }) => (
        <Text style={styles.contentText} numberOfLines={2}>
          {truncateText(item.content)}
        </Text>
      ),
    },
    {
      key: "message_type",
      label: "Type",
      render: (item: IMessage & { id: number }) => (
        <Chip
          mode="flat"
          textStyle={{ fontSize: 12 }}
          style={{ height: 28 }}
          theme={{
            fonts: {
              labelLarge: {
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              },
            },
          }}
        >
          {adminMessageService.getMessageTypeDisplayName(item.message_type || "text")}
        </Chip>
      ),
    },
    {
      key: "sent_at",
      label: "Sent At",
      render: (item: IMessage & { id: number }) => (
        <Text style={styles.cellText}>
          {item.sent_at
            ? new Date(item.sent_at).toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })
            : "-"}
        </Text>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: IMessage & { id: number }) => (
        <View style={{ flexDirection: "row", gap: 4 }}>
          {item.read_at && (
            <View style={[styles.badge, styles.readBadge]}>
              <Text style={[styles.cellText, { fontSize: 12 }]}>Read</Text>
            </View>
          )}
          {!item.read_at && (
            <View style={[styles.badge, styles.unreadBadge]}>
              <Text style={[styles.cellText, { fontSize: 12 }]}>Unread</Text>
            </View>
          )}
          {item.is_pinned && (
            <View style={[styles.badge, styles.pinnedBadge]}>
              <Text style={[styles.cellText, { fontSize: 12 }]}>Pinned</Text>
            </View>
          )}
        </View>
      ),
    },
  ];

  const renderActions = (message: IMessage & { id: number }) => {
    // Convert back to original IMessage type for callbacks
    const originalMessage: IMessage = {
      id: message.id,
      match_id: message.match_id,
      sender_id: message.sender_id,
      content: message.content,
      message_type: message.message_type,
      sent_at: message.sent_at,
      read_at: message.read_at,
      deleted_at: message.deleted_at,
      is_pinned: message.is_pinned,
      pinned_at: message.pinned_at,
      reply_to_message_id: message.reply_to_message_id,
      edited_at: message.edited_at,
    };

    return (
      <MessageActions
        message={originalMessage}
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