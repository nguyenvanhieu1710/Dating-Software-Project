import React from "react";
import { Appbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface LikesHeaderProps {
  title?: string;
}

export default function LikesHeader({ title = "Likes" }: LikesHeaderProps) {
  return (
    <Appbar.Header elevated={false} style={{ backgroundColor: "transparent" }}>
      <Appbar.Action
        icon={() => <Ionicons name="heart" size={24} color="#8B5CF6" />}
        onPress={() => {}}
        accessibilityLabel="logo"
      />
      <Appbar.Content
        title={title}
        titleStyle={{ fontSize: 20, fontWeight: "700", color: "#6B21A8" }}
      />
    </Appbar.Header>
  );
}
