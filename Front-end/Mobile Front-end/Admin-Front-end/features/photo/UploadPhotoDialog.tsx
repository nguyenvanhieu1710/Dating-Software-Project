import * as React from "react";
import {
  Dialog,
  Portal,
  Button,
  ActivityIndicator,
  useTheme,
  Menu,
} from "react-native-paper";

type Props = {
  visible: boolean;
  users: any;
  userId: string;
  loading?: boolean;
  onClose: () => void;
  onChangeUserId: (val: string) => void;
  onPickFromGallery: () => void;
  onPickFromComputer: () => void;
};

export default function UploadPhotoDialog({
  visible,
  users,
  userId,
  loading = false,
  onClose,
  onChangeUserId,
  onPickFromGallery,
  onPickFromComputer,
}: Props) {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = React.useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose}>
        <Dialog.Title
          style={{ fontFamily: theme.fonts.titleLarge.fontFamily }}
        >
          Upload Photo
        </Dialog.Title>
        <Dialog.Content>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Button
                mode="outlined"
                onPress={openMenu}
                disabled={loading}
                style={{ marginBottom: 16 }}
                textColor={theme.colors.onSurface}
              >
                {userId
                  ? users.find((u: any) => u.id === userId)?.first_name || "Select a user"
                  : "Select a user"}
              </Button>
            }
          >
            {users.length > 0 ? (
              users.map((user: any) => (
                <Menu.Item
                  key={user.id}
                  onPress={() => {
                    onChangeUserId(user.id);
                    closeMenu();
                  }}
                  title={`${user.id} - ${user.first_name} (${user.email})`}
                />
              ))
            ) : (
              <Menu.Item title="No users available" disabled />
            )}
          </Menu>

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
