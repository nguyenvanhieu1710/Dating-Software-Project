import React from "react";
import { Appbar, Avatar, IconButton } from "react-native-paper";
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
  return (
    <Appbar.Header
      style={{
        backgroundColor: "#FFF9FB",
        elevation: 0,
        borderBottomWidth: 1,
        borderBottomColor: "#F3E8FF",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <Avatar.Icon
          size={40}
          icon="account-circle"
          color="#6D28D9"
          style={{ backgroundColor: "#F3E8FF", marginRight: 12, marginLeft: 12 }}
        />
        <Appbar.Content
          title={title}
          titleStyle={{ fontSize: 20, fontWeight: "700", color: "#1F2937" }}
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
