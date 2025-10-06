import * as React from "react";
import { Dialog, Portal, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import SubscriptionForm from "./SubscriptionForm";
import { ISubscription } from "@/types/subscription";

type Props = {
  visible: boolean;
  subscription: ISubscription | null;
  onClose: () => void;
  onSave: (subscription: ISubscription) => void;
};

export default function SubscriptionDialog({ visible, subscription, onClose, onSave }: Props) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    dialog: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      margin: 20,
      maxHeight: '90%',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.onSurface,
      textAlign: 'center',
      paddingHorizontal: 24,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline + '20',
    },
    content: {
      paddingHorizontal: 24,
      paddingVertical: 0,
      flex: 1,
    },
  });

  return (
    <Portal>
      <Dialog 
        visible={visible} 
        onDismiss={onClose}
        style={styles.dialog}
      >
        <Dialog.Title style={styles.title}>
          {subscription ? "Edit Subscription" : "Add New Subscription"}
        </Dialog.Title>
        <Dialog.Content style={styles.content}>
          <SubscriptionForm
            initialData={subscription}
            onSubmit={onSave}
            onCancel={onClose}
          />
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}