import React from "react";
import { FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import {
  Appbar,
  Avatar,
  Button,
  Card,
  IconButton,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
const defaultAvatar = require("@/assets/images/avatar.jpg");
import Header from "@/components/header/Header";
import ButtonFooter from "@/components/footer/ButtonFooter";

interface UserItem {
  id: string;
  name: string;
  avatar: string | null;
  status: "online" | "offline" | "add";
}

const USERS: UserItem[] = [
  {
    id: "1",
    name: "Alex",
    avatar: defaultAvatar,
    status: "online",
  },
  {
    id: "2",
    name: "Sarah",
    avatar: defaultAvatar,
    status: "online",
  },
  {
    id: "3",
    name: "Mike",
    avatar: defaultAvatar,
    status: "offline",
  },
  {
    id: "4",
    name: "Emma",
    avatar: defaultAvatar,
    status: "online",
  },
  {
    id: "5",
    name: "John",
    avatar: defaultAvatar,
    status: "offline",
  },
  { id: "6", name: "Add", avatar: null, status: "add" },
];

const renderItem = ({ item }: { item: UserItem }) => {
  if (item.status === "add") {
    return (
      <Surface
        style={{
          margin: 8,
          padding: 16,
          borderRadius: 50,
          alignItems: "center",
          justifyContent: "center",
          borderStyle: "dashed",
          borderWidth: 1,
        }}
      >
        <IconButton icon="account-plus" size={28} />
        <Text variant="labelSmall">Add</Text>
      </Surface>
    );
  }

  return (
    <Surface
      style={{ margin: 8, alignItems: "center", width: 90, elevation: 1 }}
    >
      <Avatar.Image size={72} source={item.avatar || defaultAvatar} />
      {item.status === "online" && (
        <Surface
          style={{
            position: "absolute",
            right: 10,
            bottom: 30,
            width: 14,
            height: 14,
            borderRadius: 7,
          }}
          children={undefined}
        />
      )}
      <Text variant="bodySmall" style={{ marginTop: 6 }} numberOfLines={1}>
        {item.name}
      </Text>
    </Surface>
  );
};

export default function FriendsScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Surface style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Friends" />

      <FlatList
        ListHeaderComponent={
          <>
            <Card style={{ margin: 16, padding: 12 }}>
              <Card.Title title="Double Date Friends" />
              <FlatList
                data={USERS}
                numColumns={3}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                scrollEnabled={false}
                contentContainerStyle={{ justifyContent: "center" }}
              />
              <Text
                variant="bodySmall"
                style={{
                  textAlign: "center",
                  color: theme.colors.onSurfaceVariant,
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                }}
              >
                Invite up to 3 friends to pair up on Double Date
              </Text>
            </Card>

            <Card style={{ margin: 16, padding: 16 }}>
              <Card.Title title="Invites" />
              <Surface
                style={{
                  borderRadius: 12,
                  padding: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.colors.surfaceVariant,
                }}
              >
                <IconButton icon="account-group-outline" size={48} />
                <Text
                  variant="bodyMedium"
                  style={{
                    textAlign: "center",
                    marginTop: 8,
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  You'll see your Double Date friends here
                </Text>
              </Surface>
            </Card>
          </>
        }
        data={undefined}
        renderItem={undefined}
      />

      <ButtonFooter
        icon="account-plus"
        label="Invite Friends"
        onPress={() => {}}
      />
    </Surface>
  );
}
