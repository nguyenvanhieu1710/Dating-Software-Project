import React from "react";
import { Card, Text, useTheme } from "react-native-paper";
import { SwipedUser } from "@/types/swipe";
import { View, TouchableOpacity } from "react-native";
import { router } from "expo-router";

type Props = {
  user: SwipedUser;
  isGold: boolean;
  calculateAge: (dob: string) => number;
};

export default function LikesCard({ user, isGold, calculateAge }: Props) {
  const theme = useTheme();
  const photoUrl = `${process.env.EXPO_PUBLIC_API_URL}${user.photo_url}`;

  const handlePress = () => {
    // console.log("userid:", user.swiper_user_id.toString());
    router.push({
      pathname: "/profile-detail",
      params: { userId: user.swiper_user_id.toString() },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card style={{ margin: 8, width: 170 }} mode="elevated">
        <Card.Cover source={{ uri: photoUrl }} style={{ height: 120 }} />
        <Card.Content>
          {isGold ? (
            <View>
              <Text
                variant="titleMedium"
                style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
              >
                {user.first_name}, {calculateAge(user.dob!)}
              </Text>
              {user.job_title && (
                <Text
                  variant="bodyMedium"
                  style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
                >
                  {user.job_title}
                </Text>
              )}
              {user.school && (
                <Text
                  variant="bodySmall"
                  style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
                >
                  {user.school}
                </Text>
              )}
              {user.bio && (
                <Text
                  variant="bodySmall"
                  numberOfLines={2}
                  style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
                >
                  {user.bio}
                </Text>
              )}
            </View>
          ) : (
            <Text
              variant="titleMedium"
              style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              Hidden
            </Text>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}
