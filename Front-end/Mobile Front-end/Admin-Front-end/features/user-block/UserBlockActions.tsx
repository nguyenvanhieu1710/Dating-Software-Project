import * as React from "react";
import { View, StyleSheet } from "react-native";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { IUserBlock } from "@/types/user-block";

type Props = {
  block: IUserBlock;
  onUnblock: (block: IUserBlock) => void;
};

const UserBlockActions = ({ block, onUnblock }: Props) => {
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
        title="Unblock"
        onPress={() => onUnblock(block)}
        mode="text"
        size="small"
        style={[styles.actionButton, { minWidth: 50 }]}
      />
    </View>
  );
};

export default UserBlockActions;