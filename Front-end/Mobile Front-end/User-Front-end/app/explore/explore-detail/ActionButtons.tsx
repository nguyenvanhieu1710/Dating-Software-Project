import React from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
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
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 20,
      }}
    >
      <IconButton
        icon={() => <Ionicons name="refresh" size={22} color="#fff" />}
        size={48}
        style={{ backgroundColor: "#6B7280" }}
        onPress={onRewind}
      />
      <IconButton
        icon={() => <Ionicons name="close" size={26} color="#fff" />}
        size={64}
        style={{ backgroundColor: "#EF4444" }}
        onPress={onPass}
      />
      <IconButton
        icon={() => <Ionicons name="star" size={22} color="#fff" />}
        size={48}
        style={{ backgroundColor: "#3B82F6" }}
        onPress={onSuperlike}
      />
      <IconButton
        icon={() => <Ionicons name="heart" size={26} color="#fff" />}
        size={64}
        style={{ backgroundColor: "#10B981" }}
        onPress={onLike}
      />
      <IconButton
        icon={() => <Ionicons name="flash" size={22} color="#fff" />}
        size={48}
        style={{ backgroundColor: "#8B5CF6" }}
        onPress={onBoost}
      />
    </View>
  );
}
