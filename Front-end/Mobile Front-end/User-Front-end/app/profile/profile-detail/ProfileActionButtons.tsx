import React from "react";
import { View } from "react-native";
import { Surface, IconButton } from "react-native-paper";
import { useTheme } from "react-native-paper";
import { Platform } from "react-native";
import { router } from "expo-router";
import { swipeService } from "@/services/swipe.service";
import { ISwipe, CreateSwipeRequest } from "@/types/swipe";
import { userService } from "@/services/user.service";

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
        action: "like",
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
        <IconButton
          icon="star"
          mode="contained"
          size={28}
          iconColor="#fff"
          containerColor={theme.colors.primary}
          style={{ marginHorizontal: 12 }}
          onPress={() => {
            handleSuperLike();
          }}
        />
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