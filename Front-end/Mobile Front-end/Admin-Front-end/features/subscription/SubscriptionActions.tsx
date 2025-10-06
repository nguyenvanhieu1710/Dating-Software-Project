import * as React from "react";
import { View, StyleSheet } from "react-native";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { ISubscription } from "@/types/subscription";
import { useTheme } from "react-native-paper";

type Props = {
  subscription: ISubscription;
  onEdit: (subscription: ISubscription) => void;
  onDelete: (subscription: ISubscription) => void;
};

const SubscriptionActions = ({ subscription, onEdit, onDelete }: Props) => {
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
        onPress={() => onEdit(subscription)}
        mode="contained"
        size="small"
        style={styles.actionButton} 
      />

      {/* <PrimaryButton
        title="Delete"
        onPress={() => onDelete(subscription)}
        mode="text"
        size="small"
        style={[styles.actionButton, { minWidth: 50 }]}
      /> */}
    </View>
  );
};

export default SubscriptionActions;
