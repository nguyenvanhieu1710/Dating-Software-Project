import React from "react";
import { View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface ProfileHeaderProps {
  name?: string;
  age?: number;
}

export const ProfileDetailHeader: React.FC<ProfileHeaderProps> = ({
  name,
  age,
}) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: theme.colors.surface,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <Text
        variant="headlineSmall"
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 8,
          textAlign: "center",
          color: theme.colors.primary,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        }}
      >
        {name}, {age}
      </Text>
      <TouchableRipple
        onPress={() => router.push("/")}
        rippleColor={theme.colors.primary}
        borderless
      >
        <Ionicons name="arrow-down" size={24} color={theme.colors.primary} />
      </TouchableRipple>
    </View>
  );
};
