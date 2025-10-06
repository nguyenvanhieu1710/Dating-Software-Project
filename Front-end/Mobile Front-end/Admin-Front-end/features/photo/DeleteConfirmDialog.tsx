import * as React from "react";
import {
  Dialog,
  Portal,
  Button,
  Text,
  Icon,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { AdminPhoto } from "@/services/adminPhotoService";

type Props = {
  visible: boolean;
  photo: AdminPhoto | null;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmDialog({
  visible,
  photo,
  loading = false,
  onCancel,
  onConfirm,
}: Props) {
  const theme = useTheme();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Icon icon="alert" />
        <Dialog.Title style={{ fontFamily: theme.fonts.titleLarge.fontFamily }}>
          Delete Photo
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Are you sure you want to delete{" "}
            <Text style={{ fontWeight: "600" }}>
              {photo ? `photo #${photo.id}` : "this photo"}
            </Text>
            ? This action cannot be undone.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={onConfirm}
            buttonColor={theme.colors.error}
            disabled={loading}
          >
            {loading ? <ActivityIndicator size="small" /> : "Delete"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
