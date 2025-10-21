import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Searchbar, Button, Surface } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { notificationService } from "@/services/notification.service";
import {
  INotification,
  PaginationMeta,
  NotificationQueryParams,
} from "@/types/notification";
import NotificationItem from "./notification/NotificationItem";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/header/Header";
import NotificationToast from "./notification/Notification";

export default function NotificationListScreen() {
  const theme = useTheme();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRead, setFilterRead] = useState<boolean | null>(null);

  const limit = 20; // Number of notifications per page

  // Load current user ID
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user_data");
        if (userJson) {
          const user = JSON.parse(userJson);
          setCurrentUserId(user.id);
        }
      } catch (err) {
        console.error("Failed to load user data", err);
        setError("Failed to load user data");
      }
    };
    loadCurrentUser();
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!currentUserId) return;
    try {
      setIsLoading(true);
      const params: NotificationQueryParams = {
        page,
        limit,
        user_id: currentUserId,
      };
      const response = await notificationService.getNotificationsByUserId(
        currentUserId,
        params
      );
      // console.log("response of notification: ", response);
      if (response.success && Array.isArray(response.data)) {
        const sortedNotifications =
          notificationService.sortNotificationsBySentAt(response.data);
        setNotifications(
          searchQuery
            ? notificationService.searchNotificationsLocally(
                sortedNotifications,
                searchQuery
              )
            : sortedNotifications
        );
        setPaginationMeta(response.data.pagination);
      } else {
        setError(response.message || "Failed to load notifications");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [currentUserId, page, searchQuery]);

  useEffect(() => {
    if (currentUserId) {
      fetchNotifications();
    }
  }, [currentUserId, page, fetchNotifications]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle search
  const onSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  // Handle notification press
  const handleNotificationPress = (notification: INotification) => {
    console.log("Notification pressed:", notification);
    // Add navigation or action handling here
  };

  // Handle delete notification
  const handleDelete = async (id: number) => {
    try {
      console.log("Deleting notification with ID:", id);
      //   const response = await notificationService.deleteNotification(id);
      //   if (response.success) {
      //     setNotifications((prev) => prev.filter((n) => n.id !== id));
      //   } else {
      //     setError(response.message || "Failed to delete notification");
      //   }
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError("Failed to delete notification");
    }
  };

  // Handle mark all as read
  const handleMarkAllRead = async () => {
    if (!currentUserId) return;
    try {
      const response = await notificationService.markAllAsRead(currentUserId);
      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            read_at: new Date().toISOString(),
            is_read: true,
          }))
        );
      } else {
        setError(response.message || "Failed to mark all as read");
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
      setError("Failed to mark all notifications as read");
    }
  };

  // Handle filter toggle
  const toggleFilter = (readStatus: boolean | null) => {
    setFilterRead(readStatus);
    setPage(1);
  };

  // Render empty state
  const renderEmpty = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Ionicons
        name="notifications-off"
        size={48}
        color={theme.colors.onSurfaceVariant}
      />
      <Text
        style={{
          marginTop: 16,
          fontSize: 18,
          fontWeight: "600",
          color: theme.colors.onSurface,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        }}
      >
        No notifications
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 14,
          color: theme.colors.onSurfaceVariant,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
          textAlign: "center",
        }}
      >
        You don't have any notifications yet.
      </Text>
    </View>
  );

  // Render loading state
  if (isLoading && page === 1) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator
            animating
            size="large"
            color={theme.colors.primary}
          />
          <Text
            style={{
              marginTop: 12,
              color: theme.colors.onBackground,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Loading notifications...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render error state
  if (error) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Ionicons name="warning" size={48} color={theme.colors.error} />
          <Text
            style={{
              marginTop: 16,
              color: theme.colors.error,
              textAlign: "center",
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            {error}
          </Text>
          <Button
            mode="contained"
            onPress={fetchNotifications}
            style={{ marginTop: 16 }}
          >
            Try Again
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Surface style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <NotificationToast onPress={handleNotificationPress} />
      <Header title="Notifications" />
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={handleNotificationPress}
            onDelete={handleDelete}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (paginationMeta && page < paginationMeta.totalPages) {
            setPage((prev) => prev + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading && page > 1 ? (
            <View style={{ padding: 16, alignItems: "center" }}>
              <ActivityIndicator
                animating
                size="small"
                color={theme.colors.primary}
              />
            </View>
          ) : null
        }
      />
      {paginationMeta && (
        <View
          style={{
            padding: 16,
            alignItems: "center",
            backgroundColor: theme.colors.background,
          }}
        >
          <Text
            style={{
              color: theme.colors.onSurfaceVariant,
              fontFamily: theme.fonts.bodyMedium.fontFamily,
            }}
          >
            {notificationService.getPaginationInfo(
              page,
              limit,
              paginationMeta.total
            )}
          </Text>
        </View>
      )}
    </Surface>
  );
}
