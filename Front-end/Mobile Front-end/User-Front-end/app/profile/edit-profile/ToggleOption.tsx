import React from "react";
import { View, StyleSheet } from "react-native";
import { Switch, Text, useTheme } from "react-native-paper";

interface ToggleOptionProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
}

export const ToggleOption: React.FC<ToggleOptionProps> = ({
  label,
  value,
  onValueChange,
  description,
}) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text
          variant="bodyLarge"
          style={[
            styles.label,
            {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          ]}
        >
          {label}
        </Text>
        {description && (
          <Text
            variant="bodySmall"
            style={[
              styles.description,
              {
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      <Switch value={value} onValueChange={onValueChange} color="#8B5CF6" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: "#6B7280",
  },
});
