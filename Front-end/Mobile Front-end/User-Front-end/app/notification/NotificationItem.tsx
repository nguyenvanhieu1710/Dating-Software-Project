import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme, IconButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { INotification } from "@/types/notification";

interface NotificationItemProps {
  notification: INotification;
  onPress: (notification: INotification) => void;
  onDelete: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress, onDelete }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(notification)}
      style={{
        backgroundColor: notification.read_at ? theme.colors.surface : theme.colors.surfaceVariant,
        borderRadius: 12,
        padding: 16,
        marginVertical: 4,
        marginHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: notification.read_at ? theme.colors.outline : theme.colors.primary,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.colors.primaryContainer,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Ionicons
          name={notification.data?.type === "match" ? "heart" : "notifications"}
          size={20}
          color={theme.colors.primary}
        />
      </View>
      <View style={{ flex: 1, marginRight: 8 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: notification.read_at ? "normal" : "600",
            color: theme.colors.onSurface,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
            marginBottom: 4,
          }}
          numberOfLines={1}
        >
          {notification.title}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
          numberOfLines={2}
        >
          {notification.body}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
            fontFamily: theme.fonts.bodySmall.fontFamily,
            marginTop: 4,
          }}
        >
          {notification.sent_at}
        </Text>
      </View>
      <IconButton
        icon="trash-can-outline"
        size={20}
        iconColor={theme.colors.error}
        onPress={() => onDelete(notification.id)}
      />
    </TouchableOpacity>
  );
};

export default NotificationItem;