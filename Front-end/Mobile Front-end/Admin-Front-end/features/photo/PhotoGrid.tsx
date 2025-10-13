import * as React from "react";
import { View, FlatList } from "react-native";
import {
  Card,
  Text,
  IconButton,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { IPhoto } from "@/types/photo";
import { IUser } from "@/types/user";

type Props = {
  photos: IPhoto[];
  users?: IUser[];
  isLoading?: boolean;
  onView: (photo: IPhoto) => void;
  onDelete: (photo: IPhoto) => void;
};

export default function PhotoGrid({
  photos,
  users,
  isLoading = false,
  onView,
  onDelete,
}: Props) {
  const theme = useTheme();

  const numColumns = 6;
  const cardWidth = `${100 / numColumns - 2}%`;

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 24,
        }}
      >
        <ActivityIndicator size="large" />
        <Text
          style={{ marginTop: 8, fontFamily: theme.fonts.bodyLarge.fontFamily }}
        >
          Loading photos...
        </Text>
      </View>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", marginTop: 24 }}>
        <Text
          style={{
            fontFamily: theme.fonts.bodyLarge.fontFamily,
            color: theme.colors.onSurfaceVariant,
          }}
        >
          No photos found
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IPhoto }) => {
    const user = users?.find((u) => u.id === item.user_id);

    return (
      <Card style={{ width: cardWidth, marginBottom: 12 }}>
        {/* image + public overlay */}
        <View style={{ position: "relative" }}>
          <Card.Cover
            source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${item.url}` }}
            style={{ height: 140 }}
          />
          {item.is_public && (
            <View
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: theme.colors.primary,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 11,
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                }}
              >
                PUBLIC
              </Text>
            </View>
          )}
        </View>

        <Card.Content>
          <Text
            style={{
              fontFamily: theme.fonts.bodyLarge.fontFamily,
              fontSize: 14,
            }}
          >
            {user?.email ? user.email.split("@")[0] : "—"}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.onSurfaceVariant,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            {user?.email || ""}
          </Text>
        </Card.Content>

        <Card.Actions style={{ justifyContent: "flex-end" }}>
          <IconButton
            icon="eye"
            size={20}
            onPress={() => onView(item)}
            accessibilityLabel={`View photo ${item.id}`}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => onDelete(item)}
            accessibilityLabel={`Delete photo ${item.id}`}
          />
        </Card.Actions>
      </Card>
    );
  };

  return (
    <FlatList
      key={numColumns}
      data={photos}
      keyExtractor={(item) => String(item.id)}
      numColumns={numColumns}
      contentContainerStyle={{ padding: 8, paddingBottom: 24 }}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      initialNumToRender={10}
    />
  );
}
