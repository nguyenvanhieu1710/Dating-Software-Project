import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Appbar } from "react-native-paper";
import { useRouter } from "expo-router";

export default function Header() {
  const router = useRouter();
  return (
    <Appbar.Header>
      <Appbar.Content
        title="Chats"
        titleStyle={{ color: "#6D28D9", fontWeight: "bold" }}
        style={{ marginLeft: 8 }}
      />
      <Appbar.Action
        icon={() => <Ionicons name="people" size={24} color="#6D28D9" />}
        onPress={() => router.push("/friends")}
      />
      <Appbar.Action
        icon={() => (
          <Ionicons name="shield-checkmark" size={24} color="#6D28D9" />
        )}
        onPress={() => router.push("/safety-center")}
      />
    </Appbar.Header>
  );
}
