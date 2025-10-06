import React, { useState } from "react";
import { Platform, StatusBar } from "react-native";
import { Appbar, useTheme, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DiscoveryHeader() {
  const theme = useTheme();
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <Appbar.Header
      elevated={false}
      style={{
        backgroundColor: theme.colors.surface,
        paddingTop:
          Platform.OS === "ios" ? 44 : (StatusBar.currentHeight || 0) + 8,
        paddingBottom: 8,
        elevation: 0,
      }}
    >
      <Appbar.Content
        title="Vibe"
        titleStyle={{
          color: theme.colors.primary,
          fontWeight: "700",
          fontSize: 20,
        }}
      />

      {showSearch && (
        <TextInput
          mode="outlined"
          dense
          placeholder="Search..."
          value={query}
          onChangeText={setQuery}
          style={{
            width: 170,
            height: 36,            
            marginRight: 8,
            borderRadius: 20,
            backgroundColor: theme.colors.surfaceVariant,
          }}
          right={
            <TextInput.Icon
              icon="close"
              onPress={() => {
                setQuery("");
                setShowSearch(false);
              }}
            />
          }
        />
      )}

      <Appbar.Action
        icon={() => (
          <Ionicons name="search" size={20} color={theme.colors.primary} />
        )}
        onPress={() => setShowSearch((prev) => !prev)}
      />

      <Appbar.Action
        icon={() => (
          <Ionicons name="notifications" size={20} color={theme.colors.primary} />
        )}
        onPress={() => router.push("/notification")}
      />

      <Appbar.Action
        icon={() => (
          <Ionicons name="people" size={20} color={theme.colors.primary} />
        )}
        onPress={() => router.push("/friends")}
      />
    </Appbar.Header>
  );
}
