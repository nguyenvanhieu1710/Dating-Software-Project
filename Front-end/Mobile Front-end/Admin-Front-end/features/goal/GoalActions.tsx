import * as React from "react";
import { View, StyleSheet } from "react-native";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { IGoal } from "@/types/goal";

type Props = {
  goal: IGoal;
  onEdit: (goal: IGoal) => void;
  onDelete: (goal: IGoal) => void;
};

const GoalActions = ({ goal, onEdit, onDelete }: Props) => {
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
        onPress={() => onEdit(goal)}
        mode="contained"
        size="small"
        style={styles.actionButton}
      />
      <PrimaryButton
        title="Delete"
        onPress={() => onDelete(goal)}
        mode="text"
        size="small"
        style={[styles.actionButton, { minWidth: 50 }]}
      />
    </View>
  );
};

export default GoalActions;