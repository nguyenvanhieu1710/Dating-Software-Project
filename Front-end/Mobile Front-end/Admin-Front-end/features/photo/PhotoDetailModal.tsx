import * as React from "react";
import { Image, ScrollView } from "react-native";
import {
  Modal,
  Portal,
  Card,
  Text,
  IconButton,
  useTheme,
} from "react-native-paper";
import { AdminPhoto } from "@/services/adminPhotoService";

type Props = {
  visible: boolean;
  photo: AdminPhoto | null;
  onClose: () => void;
};

export default function PhotoDetailModal({ visible, photo, onClose }: Props) {
  const theme = useTheme();

  if (!photo) return null;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{
          margin: 20,
          borderRadius: 12,
          backgroundColor: theme.colors.surface,
          padding: 16,
        }}
      >
        <Card>
          <Card.Title
            title="Photo Details"
            titleStyle={{ fontFamily: theme.fonts.titleLarge.fontFamily }}
            right={(props) => (
              <IconButton {...props} icon="close" onPress={onClose} />
            )}
          />

          <ScrollView style={{ maxHeight: 400 }}>
            <Image
              source={{ uri: photo.url }}
              style={{ width: "100%", height: 250, borderRadius: 8 }}
              resizeMode="cover"
            />

            <Card.Content style={{ marginTop: 12 }}>
              <Text variant="bodyMedium" style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
                <Text
                  style={{
                    fontWeight: "600",
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  User:{" "}
                </Text>
                {photo.user_name}
              </Text>
              <Text variant="bodyMedium" style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
                <Text
                  style={{
                    fontWeight: "600",
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  Email:{" "}
                </Text>
                {photo.user_email}
              </Text>
              <Text variant="bodyMedium" style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
                <Text
                  style={{
                    fontWeight: "600",
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  Status:{" "}
                </Text>
                {photo.status}
              </Text>
              <Text variant="bodyMedium" style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
                <Text
                  style={{
                    fontWeight: "600",
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  Primary:{" "}
                </Text>
                {photo.is_primary ? "Yes" : "No"}
              </Text>
              <Text variant="bodyMedium" style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
                <Text
                  style={{
                    fontWeight: "600",
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  Reports:{" "}
                </Text>
                {photo.report_count || 0}
              </Text>
              <Text variant="bodyMedium" style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
                <Text
                  style={{
                    fontWeight: "600",
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  Created:{" "}
                </Text>
                {new Date(photo.created_at).toLocaleDateString()}
              </Text>
            </Card.Content>
          </ScrollView>
        </Card>
      </Modal>
    </Portal>
  );
}
