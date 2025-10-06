import * as React from "react";
import { View, FlatList } from "react-native";
import {
  Card,
  Text,
  IconButton,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { AdminPhoto } from "@/services/adminPhotoService";

type Props = {
  photos: AdminPhoto[];
  isLoading?: boolean;
  onView: (photo: AdminPhoto) => void;
  onDelete: (photo: AdminPhoto) => void;
};

export default function PhotoGrid({
  photos,
  isLoading = false,
  onView,
  onDelete,
}: Props) {
  const theme = useTheme();

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

  const renderItem = ({ item }: { item: AdminPhoto }) => {
    return (
      <Card style={{ width: "48%", marginBottom: 12 }}>
        {/* image + badges overlay */}
        <View style={{ position: "relative" }}>
          <Card.Cover source={{ uri: item.url }} style={{ height: 140 }} />
          {item.is_primary && (
            <View
              style={{
                position: "absolute",
                top: 8,
                left: 8,
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
                PRIMARY
              </Text>
            </View>
          )}

          <View
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor:
                item.status === "active"
                  ? "rgba(16,185,129,0.95)"
                  : item.status === "reported"
                  ? "rgba(245,158,11,0.95)"
                  : "rgba(239,68,68,0.95)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 10,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              {String(item.status || "").toUpperCase()}
            </Text>
          </View>
        </View>

        <Card.Content>
          <Text
            style={{
              fontFamily: theme.fonts.bodyLarge.fontFamily,
              fontSize: 14,
            }}
          >
            {item.user_name || "—"}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.onSurfaceVariant,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            {item.user_email || ""}
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
      data={photos}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      contentContainerStyle={{ padding: 8, paddingBottom: 24 }}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      initialNumToRender={10}
    />
  );
}
