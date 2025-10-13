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
import { IPhoto } from "@/types/photo";
import { IUser } from "@/types/user";

type Props = {
  visible: boolean;
  photo?: IPhoto | null;
  users: IUser[];
  onClose: () => void;
};

export default function PhotoDetailModal({
  visible,
  photo,
  users,
  onClose,
}: Props) {
  const theme = useTheme();
  const user = users.find((u) => u.id === photo?.user_id);

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
          height: "98%",
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

          <ScrollView style={{ height: "90%" }}>
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${photo.url}` }}
              style={{ width: "100%", height: 480, borderRadius: 8 }}
              resizeMode="contain"
            />

            <Card.Content style={{ marginTop: 12 }}>
              <Text
                variant="bodyMedium"
                style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  User:{" "}
                </Text>
                {user?.email ? user.email.split("@")[0] : ""}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  Email:{" "}
                </Text>
                {user?.email}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  Status:{" "}
                </Text>
                {user?.status}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  Public:{" "}
                </Text>
                {photo.is_public ? "Yes" : "No"}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  Reports:{" "}
                </Text>
                {0}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
              >
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
