import React from "react";
import { View } from "react-native";
import { Surface, IconButton } from "react-native-paper";
import { useTheme } from "react-native-paper";
import { Platform } from "react-native";
import { router } from "expo-router";
import { swipeService } from "@/services/swipe.service";
import { ISwipe, CreateSwipeRequest } from "@/types/swipe";
import { userService } from "@/services/user.service";
import { io } from "socket.io-client";

interface ProfileActionButtonsProps {
  userId: string;
}

const ProfileActionButtons: React.FC<ProfileActionButtonsProps> = ({
  userId,
}) => {
  const theme = useTheme();

  const handlePass = async () => {
    try {
      const currentUser = await userService.getCurrentUser();
      // console.log(currentUser.data);      
      if (!currentUser.data || !currentUser.data.id) {
        throw new Error("User not found");
      }
      const checkSwiped = await swipeService.checkSwiped(
        Number(currentUser.data.id),
        Number(userId)
      );     
      if(checkSwiped.success){
        alert("You have already swiped this user");
        return;
      }
      const swipeData: CreateSwipeRequest = {
        swiper_user_id: Number(currentUser.data.id),
        swiped_user_id: Number(userId),
        action: "pass",
      };
      const response = await swipeService.performSwipe(swipeData);
      // console.log(response);
      if(response.success){
        router.replace("/")
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSuperLike = () => {
    router.push("/consumable");
  };

  const handleLike = async () => {
    try {
      const currentUser = await userService.getCurrentUser();
      // console.log(currentUser.data);
      if (!currentUser.data || !currentUser.data.id) {
        throw new Error("User not found");
      }
      const userdetail = await userService.getUserById(userId);
      // console.log("userdetail: ", userdetail);
      const checkSwiped = await swipeService.checkSwiped(
        Number(currentUser.data.id),
        Number(userId)
      );
      if (
        checkSwiped.success &&
        Array.isArray(checkSwiped.data) &&
        checkSwiped.data.length > 0
      ) {
        const action = checkSwiped.data[0].action;

        if (action === "like") {
          alert("You liked this user");
          return;
        }

        if (action === "pass") {
          alert("You passed this user");
          return;
        }
      }
      const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
        query: { userId: currentUser.data.id.toString() },
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected for sending like notification");

        const firstName = userdetail.data?.profile?.first_name || "Someone";

        const notificationData = {
          swiper_user_id: Number(currentUser.data?.id),
          swiped_user_id: Number(userId),
          title: "New Like!",
          body: `${firstName} liked you! Check out their profile.`,
          data: {
            type: "like",
            swiper_user_id: currentUser.data?.id.toString(),
          },
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
        // console.log("notificationData: ", notificationData);

        socket.emit("send-like-notification", notificationData);
        console.log("📤 Sent like notification:", notificationData);
      });

      socket.on("connect_error", (err) => {
        console.error(
          "❌ Socket connection error for like notification:",
          err.message
        );
      });
      const swipeData: CreateSwipeRequest = {
        swiper_user_id: Number(currentUser.data.id),
        swiped_user_id: Number(userId),
        action: "like",
      };
      const response = await swipeService.performSwipe(swipeData);
      // console.log("response of like:", response);
      if (response.success) {
        alert("Like sent successfully");
        router.replace("/");
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <Surface
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
        paddingBottom: Platform.OS === "ios" ? 30 : 16,
        backgroundColor: theme.colors.surface,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <IconButton
          icon="close"
          mode="contained"
          size={28}
          iconColor="#fff"
          containerColor={theme.colors.primary}
          style={{ marginHorizontal: 12 }}
          onPress={() => {
            handlePass();
          }}
        />
        {/* <IconButton
          icon="star"
          mode="contained"
          size={28}
          iconColor="#fff"
          containerColor={theme.colors.primary}
          style={{ marginHorizontal: 12 }}
          onPress={() => {
            handleSuperLike();
          }}
        /> */}
        <IconButton
          icon="heart"
          mode="contained"
          size={28}
          iconColor="#fff"
          containerColor={theme.colors.primary}
          style={{ marginHorizontal: 12 }}
          onPress={() => {
            handleLike();
          }}
        />
      </View>
    </Surface>
  );
};

export default ProfileActionButtons;