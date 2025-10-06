import * as React from "react";
import { Dialog, Portal, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import ModerationForm from "./ModerationForm";
import { IModerationReport } from "@/types/moderation-report";

type Props = {
  visible: boolean;
  report: IModerationReport | null;
  onClose: () => void;
  onSave: (report: IModerationReport) => void;
};

export default function ModerationDialog({ visible, report, onClose, onSave }: Props) {
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
          {report ? "Edit Moderation Report" : "Create New Moderation Report"}
        </Dialog.Title>
        <Dialog.Content style={styles.content}>
          <ModerationForm initialData={report} onSubmit={onSave} onCancel={onClose} />
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}