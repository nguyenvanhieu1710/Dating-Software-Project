import * as React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { TextInput, HelperText, useTheme } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  disabled?: boolean;
  mode?: "date" | "time" | "datetime";
};

export default function DatePickerField({
  label,
  value,
  onChange,
  error,
  disabled = false,
  mode = "date",
}: Props) {
  const [show, setShow] = React.useState(false);
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    inputContainer: { position: "relative" },
    textInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      elevation: 2,
    },
    iconContainer: {
      position: "absolute",
      right: 12,
      top: "50%",
      transform: [{ translateY: -12 }],
      zIndex: 1,
    },
    helperText: { marginTop: 4, marginLeft: 4 },
    disabledInput: { opacity: 0.6 },
  });

  const handlePress = () => {
    if (!disabled) setShow(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {Platform.OS === "web" ? (
          <input
            type={mode === "time" ? "time" : "date"}
            value={
              value
                ? mode === "time"
                  ? value.toISOString().substring(11, 16) // HH:mm
                  : value.toISOString().substring(0, 10) // YYYY-MM-DD
                : ""
            }
            disabled={disabled}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              onChange(newDate);
            }}
            style={{
              width: "98%",
      height: 56,
      padding: "0 16px",
      borderRadius: 12,
      border: error
        ? `2px solid ${theme.colors.error}`
        : `1px solid ${theme.colors.outline}`,
      fontSize: 16,
      fontFamily: "inherit",
      backgroundColor: disabled ? theme.colors.surfaceDisabled : theme.colors.surface,
      color: value ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
      outline: "none",
      boxShadow: "0px 2px 3px rgba(0,0,0,0.1)",
            }}
          />
        ) : (
          <>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
              <TextInput
                label={label}
                value={value ? value.toLocaleDateString("vi-VN") : ""}
                mode="outlined"
                error={!!error}
                editable={false}
                pointerEvents="none"
                style={[styles.textInput, disabled && styles.disabledInput]}
                outlineStyle={{
                  borderRadius: 12,
                  borderWidth: error ? 2 : 1,
                  borderColor: error ? theme.colors.error : theme.colors.outline,
                }}
                contentStyle={{
                  paddingRight: 40,
                  fontSize: 16,
                  color: value ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
                }}
                theme={{
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: theme.colors.primary,
                    outline: error ? theme.colors.error : theme.colors.outline,
                    onSurface: value ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
                  },
                }}
                disabled={disabled}
              />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={disabled ? theme.colors.onSurfaceVariant : theme.colors.primary}
              />
            </View>
          </>
        )}
      </View>

      {show && Platform.OS !== "web" && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display="default"
          onChange={(event, date) => {
            setShow(false);
            if (date) onChange(date);
          }}
        />
      )}

      {error && (
        <HelperText type="error" style={[styles.helperText, { color: theme.colors.error }]}>
          {error}
        </HelperText>
      )}
    </View>
  );
}
