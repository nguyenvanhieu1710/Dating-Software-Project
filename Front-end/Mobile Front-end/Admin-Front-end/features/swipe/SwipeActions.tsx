import * as React from "react";
import { View, StyleSheet } from "react-native";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { ISwipe } from "@/types/swipe";

type Props = {
  swipe: ISwipe;
  onEdit: (swipe: ISwipe) => void;
  onDelete: (swipe: ISwipe) => void;
};

const SwipeActions = ({ swipe, onEdit, onDelete }: Props) => {
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
        onPress={() => onEdit(swipe)}
        mode="contained"
        size="small"
        style={styles.actionButton}
      />
      <PrimaryButton
        title="Undo"
        onPress={() => onDelete(swipe)}
        mode="text"
        size="small"
        style={[styles.actionButton, { minWidth: 50 }]}
      />
    </View>
  );
};

export default SwipeActions;