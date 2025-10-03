import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { Button, Text } from "react-native-paper";
import LikesHeader from "../Likes/LikesHeader";
import LikesGrid from "../Likes/LikesGrid";
import { userService } from "@/services/user.service";
import { swipeService } from "@/services/swipe.service";
import { SwipedUser } from "@/types/swipe";
import { useTheme } from "react-native-paper";

export default function LikesScreen() {
  const theme = useTheme();
  const [users, setUsers] = useState<SwipedUser[]>([]);
  const [isGold, setIsGold] = useState(false);

  useEffect(() => {
    const fetchUsersWhoLikedYou = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        if (!currentUser.data) return;
        const response = await swipeService.getSwipedByUsers(
          currentUser.data.id,
          "like"
        );
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsersWhoLikedYou();
  }, []);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9FB" }}>
      <LikesHeader title="Likes" />
      <Text
        variant="headlineMedium"
        style={{
          margin: 16,
          fontWeight: "700",
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        }}
      >
        {users.length} likes
      </Text>
      <LikesGrid users={users} isGold={isGold} calculateAge={calculateAge} />
      <Button
        mode="contained"
        onPress={() => setIsGold(true)}
        style={{
          borderRadius: 30,
          paddingVertical: 8,
          position: "absolute",
          bottom: 16,
          width: "90%",
          marginLeft: "5%",
          marginRight: "5%",
        }}
        labelStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
      >
        See Who Likes You
      </Button>
    </SafeAreaView>
  );
}
