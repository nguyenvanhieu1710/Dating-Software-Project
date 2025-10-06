import * as React from "react";
import { View, StyleSheet } from "react-native";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { IInterest } from "@/types/interest";

type Props = {
  interest: IInterest;
  onEdit: (interest: IInterest) => void;
  onDelete: (interest: IInterest) => void;
};

const InterestActions = ({ interest, onEdit, onDelete }: Props) => {

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
        onPress={() => onEdit(interest)}
        mode="contained"
        size="small"
        style={styles.actionButton}
      />
      <PrimaryButton
        title="Delete"
        onPress={() => onDelete(interest)}
        mode="text"
        size="small"
        style={[styles.actionButton, { minWidth: 50 }]}
      />
    </View>
  );
};

export default InterestActions;