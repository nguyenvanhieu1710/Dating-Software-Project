import * as React from "react";
import { TextInput, HelperText, useTheme } from "react-native-paper";
import { View, ViewStyle } from "react-native";

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  multiline?: boolean;
  numberOfLines?: number;
  placeholder?: string;
  style?: any;
  editable?: boolean;
};

export default function TextField({
  label,
  value,
  onChangeText,
  error,
  disabled,
  secureTextEntry,
  keyboardType = "default",
  multiline,
  numberOfLines,
  placeholder,
  style,
  editable,
}: Props) {
  const theme = useTheme();

  return (
    <View style={{ marginBottom: 16 }}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        mode="outlined"
        error={!!error}
        contentStyle={{
          paddingHorizontal: 16,
          fontSize: 16,
        }}
        outlineStyle={{
          borderRadius: 12,
          borderWidth: error ? 2 : 1,
          borderColor: error ? theme.colors.error : theme.colors.outline,
        }}
        theme={{
          colors: {
            primary: theme.colors.primary,
            outline: theme.colors.outline,
            onSurfaceVariant: theme.colors.onSurfaceVariant,
          },
        }}
        disabled={disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholder={placeholder}
        style={style}
        editable={editable}
      />
      {error ? (
        <HelperText type="error" style={{ 
          marginTop: 4, 
          fontSize: 12,
          marginLeft: 4,
        }}>
          {error}
        </HelperText>
      ) : null}
    </View>
  );
}