import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Animated, Dimensions } from "react-native";
import { useTheme, Portal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { INotification } from "@/types/notification";

const { width } = Dimensions.get("window");

interface NotificationToastProps {
  onPress?: (notification: INotification) => void;
}

export default function NotificationToast({ onPress }: NotificationToastProps) {
  const theme = useTheme();
  const [notification, setNotification] = useState<INotification | null>(null);
  const [visible, setVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const slideAnim = useState(new Animated.Value(-100))[0];
  const socketRef = React.useRef<Socket | null>(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const userJson = await AsyncStorage.getItem("user_data");
      if (userJson) {
        const user = JSON.parse(userJson);
        setCurrentUserId(user.id);
      }
    };
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
      query: { userId: currentUserId.toString() },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Notification socket connected:", socket.id);
    });

    socket.on("receive-notification", (notif: INotification) => {
      console.log("📢 Toast received notification:", notif);
      showNotification(notif);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Toast socket connection error:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("receive-notification");
      socket.off("connect_error");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUserId]);

  const showNotification = (notif: INotification) => {
    setNotification(notif);
    setVisible(true);

    // Slide down animation
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();

    // Auto hide after 5 seconds
    setTimeout(() => {
      hideNotification();
    }, 5000);
  };

  const hideNotification = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      setNotification(null);
    });
  };

  const handlePress = () => {
    if (notification && onPress) {
      onPress(notification);
    }
    hideNotification();
  };

  if (!visible || !notification) return null;

  return (
    <Portal>
      <Animated.View
        style={{
          position: "absolute",
          top: 50,
          left: 16,
          right: 16,
          zIndex: 9999,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handlePress}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            padding: 16,
            flexDirection: "row",
            alignItems: "flex-start",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.primary,
          }}
        >
          {/* Icon */}
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
              name="notifications"
              size={20}
              color={theme.colors.primary}
            />
          </View>

          {/* Content */}
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
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
          </View>

          {/* Close button */}
          <TouchableOpacity
            onPress={hideNotification}
            style={{
              padding: 4,
            }}
          >
            <Ionicons
              name="close"
              size={20}
              color={theme.colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    </Portal>
  );
}