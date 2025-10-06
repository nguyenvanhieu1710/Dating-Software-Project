import * as React from "react";
import { View, StyleSheet } from "react-native";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { IMessage } from "@/types/message";
import { useTheme } from "react-native-paper";

type Props = {
  message: IMessage;
  onEdit: (message: IMessage) => void;
  onDelete: (message: IMessage) => void;
};

const MessageActions = ({ message, onEdit, onDelete }: Props) => {
  const theme = useTheme();

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
      <PrimaryButton
        title="Edit"
        onPress={() => onEdit(message)}
        mode="contained"
        size="small"
        style={styles.actionButton} 
      />

      <PrimaryButton
        title="Delete"
        onPress={() => onDelete(message)}
        mode="text"
        size="small"
        style={[styles.actionButton, { minWidth: 50 }]}
      />
    </View>
  );
};

export default MessageActions;