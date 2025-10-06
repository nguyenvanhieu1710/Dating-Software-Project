import * as React from "react";
import { View, StyleSheet } from "react-native";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { IUserDevice } from "@/types/user-device";

type Props = {
  device: IUserDevice;
  onEdit: (device: IUserDevice) => void;
  onDelete: (device: IUserDevice) => void;
};

const UserDeviceActions = ({ device, onEdit, onDelete }: Props) => {

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
        onPress={() => onEdit(device)}
        mode="contained"
        size="small"
        style={styles.actionButton}
      />
      <PrimaryButton
        title="Delete"
        onPress={() => onDelete(device)}
        mode="text"
        size="small"
        style={[styles.actionButton, { minWidth: 50 }]}
      />
    </View>
  );
};

export default UserDeviceActions;