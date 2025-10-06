import * as React from "react";
import { View, StyleSheet } from "react-native";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { IConsumable } from "@/types/consumable";

type Props = {
  consumable: IConsumable;
  onEdit: (consumable: IConsumable) => void;
  onDelete: (consumable: IConsumable) => void;
};

const ConsumableActions = ({ consumable, onEdit, onDelete }: Props) => {
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
        onPress={() => onEdit(consumable)}
        mode="contained"
        size="small"
        style={styles.actionButton}
      />

      {/* <PrimaryButton
        title="Delete"
        onPress={() => onDelete(consumable)}
        mode="text"
        size="small"
        style={[styles.actionButton, { minWidth: 50 }]}
      /> */}
    </View>
  );
};

export default ConsumableActions;
