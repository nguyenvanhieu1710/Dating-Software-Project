import * as React from "react";
import { Button, useTheme } from "react-native-paper";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  mode?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  style?: any;
  labelStyle?: any;
};

export default function PrimaryButton({
  title,
  onPress,
  disabled,
  mode = "contained",
  size = "medium",
  style,
  labelStyle,
}: Props) {
  const theme = useTheme();

  // Map size to appropriate styling
  const getButtonStyle = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      case 'large':
        return { paddingVertical: 12, paddingHorizontal: 24 };
      case 'medium':
      default:
        return { paddingVertical: 8, paddingHorizontal: 16 };
    }
  };

  const getLabelStyle = () => {
    switch (size) {
      case 'small':
        return { fontSize: 14 };
      case 'large':
        return { fontSize: 18 };
      case 'medium':
      default:
        return { fontSize: 16 };
    }
  };

  return (
    <Button
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      buttonColor={mode === "contained" ? theme.colors.primary : undefined}
      textColor={mode === "contained" ? "white" : theme.colors.primary}
      labelStyle={labelStyle}
      style={style}
      theme={{
        fonts: {
          labelLarge: {
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          },
        },
      }}
    >
      {title}
    </Button>
  );
}
