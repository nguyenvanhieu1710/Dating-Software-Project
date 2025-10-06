import * as React from "react";
import {
  Dialog,
  Portal,
  Button,
  Text,
  TextInput,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";

type Props = {
  visible: boolean;
  userId: string;
  loading?: boolean;
  onClose: () => void;
  onChangeUserId: (val: string) => void;
  onPickFromGallery: () => void;
  onPickFromComputer: () => void;
};

export default function UploadPhotoDialog({
  visible,
  userId,
  loading = false,
  onClose,
  onChangeUserId,
  onPickFromGallery,
  onPickFromComputer,
}: Props) {
  const theme = useTheme();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose}>
        <Dialog.Title
          style={{ fontFamily: theme.fonts.titleLarge.fontFamily }}
        >
          Upload Photo
        </Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="User ID"
            value={userId}
            onChangeText={onChangeUserId}
            keyboardType="numeric"
            style={{ marginBottom: 16 }}
          />

          <Button
            mode="contained"
            onPress={onPickFromGallery}
            disabled={loading || !userId}
            style={{ marginBottom: 12 }}
            buttonColor={theme.colors.primary}
          >
            {loading ? <ActivityIndicator color="white" /> : "From Gallery"}
          </Button>

          <Button
            mode="contained"
            onPress={onPickFromComputer}
            disabled={loading || !userId}
          >
            {loading ? <ActivityIndicator color="white" /> : "From Computer"}
          </Button>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
