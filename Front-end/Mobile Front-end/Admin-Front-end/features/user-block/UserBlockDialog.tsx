import * as React from "react";
import { Dialog, Portal, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import UserBlockForm from "./UserBlockForm";
import { IUserBlock, CreateBlockRequest } from "@/types/user-block";

type Props = {
  visible: boolean;
  block: IUserBlock | null;
  onClose: () => void;
  onSave: (block: CreateBlockRequest) => void;
};

export default function UserBlockDialog({ visible, block, onClose, onSave }: Props) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    dialog: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      margin: 20,
      maxHeight: "90%",
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.onSurface,
      textAlign: "center",
      paddingHorizontal: 24,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline + "20",
    },
    content: {
      paddingHorizontal: 24,
      paddingVertical: 0,
      flex: 1,
    },
  });

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose} style={styles.dialog}>
        <Dialog.Title style={styles.title}>
          {block ? "Edit Block" : "Add New Block"}
        </Dialog.Title>
        <Dialog.Content style={styles.content}>
          <UserBlockForm initialData={block} onSubmit={onSave} onCancel={onClose} />
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}