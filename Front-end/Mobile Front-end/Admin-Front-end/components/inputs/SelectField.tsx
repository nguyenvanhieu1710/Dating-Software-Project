import * as React from "react";
import { View, StyleSheet } from "react-native";
import { HelperText, useTheme } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

type Option = { label: string; value: string };

type Props = {
  label?: string;
  selectedValue: string;
  onValueChange?: (value: string) => void;
  options: Option[];
  error?: string;
  disabled?: boolean;
};

export default function SelectField({
  label,
  selectedValue,
  onValueChange,
  options,
  error,
  disabled,
}: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <HelperText type="info" visible style={styles.label}>
          {label}
        </HelperText>
      )}
      <View
        style={[
          styles.pickerContainer,
          {
            borderColor: error ? theme.colors.error : theme.colors.surfaceVariant,
            backgroundColor: disabled ? theme.colors.surfaceDisabled : theme.colors.surface,
            shadowColor: theme.colors.shadow,
          },
        ]}
      >
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
          enabled={!disabled}
        >
          {options.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
      {error ? <HelperText type="error" style={styles.error}>{error}</HelperText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    height: 48,
    fontSize: 16,
  },
  error: {
    marginTop: 4,
  },
});