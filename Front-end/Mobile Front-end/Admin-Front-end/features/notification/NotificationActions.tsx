import * as React from "react";
import { View, StyleSheet } from "react-native";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { INotification } from "@/types/notification";

type Props = {
  notification: INotification;
  onEdit: (notification: INotification) => void;
  onDelete: (notification: INotification) => void;
};

const NotificationActions = ({ notification, onEdit, onDelete }: Props) => {
  const styles = StyleSheet.create({
    actionContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 8,
      flexWrap: "wrap",
    },
    actionButton: {
      minWidth: 60,
    },
  });

  return (
    <View style={styles.actionContainer}>
      {/* <PrimaryButton
        title="Edit"
        onPress={() => onEdit(notification)}
        mode="contained"
        size="small"
        style={styles.actionButton}
      /> */}
      <PrimaryButton
        title="Delete"
        onPress={() => onDelete(notification)}
        mode="text"
        size="small"
        style={[styles.actionButton, { minWidth: 50 }]}
      />
    </View>
  );
};

export default NotificationActions;