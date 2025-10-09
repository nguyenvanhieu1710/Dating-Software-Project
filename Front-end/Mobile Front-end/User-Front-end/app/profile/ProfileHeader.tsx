import React from "react";
import { Appbar, Avatar, IconButton, useTheme } from "react-native-paper";
import { View } from "react-native";

type Props = {
  title?: string;
  onSettings: () => void;
  onSafety: () => void;
};

export default function ProfileHeader({
  title = "Profile",
  onSettings,
  onSafety,
}: Props) {
  const theme = useTheme();
  return (
    <Appbar.Header
      style={{
        backgroundColor: theme.colors.surface,
        elevation: 0,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.background,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <Avatar.Icon
          size={40}
          icon="account-circle"
          color={theme.colors.primary}
          style={{ backgroundColor: theme.colors.background, marginRight: 12, marginLeft: 12 }}
        />
        <Appbar.Content
          title={title}
          titleStyle={{ fontSize: 20, fontWeight: "700", color: "#1F2937", fontFamily: theme.fonts.bodyLarge.fontFamily }}
        />
      </View>

      <IconButton
        icon="shield-check"
        size={22}
        onPress={onSafety}
        style={{ backgroundColor: "#F3E8FF" }}
      />
      <IconButton
        icon="cog"
        size={22}
        onPress={onSettings}
        style={{ backgroundColor: "#F3E8FF" }}
      />
    </Appbar.Header>
  );
}
