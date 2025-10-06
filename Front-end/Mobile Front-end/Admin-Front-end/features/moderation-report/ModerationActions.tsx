import * as React from "react";
import { View, StyleSheet } from "react-native";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { IModerationReport } from "@/types/moderation-report";

type Props = {
  report: IModerationReport;
  onEdit: (report: IModerationReport) => void;
  onDelete: (report: IModerationReport) => void;
};

const ModerationActions = ({ report, onEdit, onDelete }: Props) => {
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
        onPress={() => onEdit(report)}
        mode="contained"
        size="small"
        style={styles.actionButton}
      />
      <PrimaryButton
        title="Delete"
        onPress={() => onDelete(report)}
        mode="text"
        size="small"
        style={[styles.actionButton, { minWidth: 50 }]}
      />
    </View>
  );
};

export default ModerationActions;