import * as React from "react";
import { View, StyleSheet } from "react-native";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { ISetting } from "@/types/setting";
import { useTheme } from "react-native-paper";

type Props = {
  setting: ISetting;
  onEdit: (setting: ISetting) => void;
  onReset: (setting: ISetting) => void;
};

const SettingActions = ({ setting, onEdit, onReset }: Props) => {
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
        onPress={() => onEdit(setting)}
        mode="contained"
        size="small"
        style={styles.actionButton} 
      />

      <PrimaryButton
        title="Reset"
        onPress={() => onReset(setting)}
        mode="text"
        size="small"
        style={[styles.actionButton, { minWidth: 50 }]}
      />
    </View>
  );
};

export default SettingActions;