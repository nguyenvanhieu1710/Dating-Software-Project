import React from "react";
import { View } from "react-native";
import { IconButton, Surface, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onRewind: () => void;
  onPass: () => void;
  onSuperlike: () => void;
  onLike: () => void;
  onBoost: () => void;
};

export default function ActionButtons({
  onRewind,
  onPass,
  onSuperlike,
  onLike,
  onBoost,
}: Props) {
  const theme = useTheme();
  return (
    <Surface
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "transparent",
        elevation: 6,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconButton
          icon={() => <Ionicons name="refresh" size={20} color="#fff" />}
          containerColor={theme.colors.primary}
          size={44}
          onPress={onRewind}
        />
        <IconButton
          icon={() => <Ionicons name="close" size={20} color="#fff" />}
          containerColor={theme.colors.primary}
          size={56}
          onPress={onPass}
        />
        <IconButton
          icon={() => <Ionicons name="star" size={20} color="#fff" />}
          containerColor={theme.colors.primary}
          size={48}
          onPress={onSuperlike}
        />
        <IconButton
          icon={() => <Ionicons name="heart" size={20} color="#fff" />}
          containerColor={theme.colors.primary}
          size={56}
          onPress={onLike}
        />
        <IconButton
          icon={() => <Ionicons name="flash" size={20} color="#fff" />}
          containerColor={theme.colors.primary}
          size={44}
          onPress={onBoost}
        />
      </View>
    </Surface>
  );
}
