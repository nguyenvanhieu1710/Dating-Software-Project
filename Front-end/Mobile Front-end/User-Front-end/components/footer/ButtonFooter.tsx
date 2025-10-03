import React from "react";
import { Button, useTheme } from "react-native-paper";

type FooterProps = {
  label: string;
  icon?: string;
  price?: string;
  onPress: () => void;
};

export default function ButtonFooter({ label, icon, price, onPress }: FooterProps) {
  const theme = useTheme();
  return (
    <Button
      mode="contained"
      onPress={onPress}
      icon={icon}
      style={{ margin: 20, borderRadius: 12, paddingVertical: 6 }}
      buttonColor={theme.colors.primary}
      theme={{
        fonts: {
          labelLarge: {
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          },
        },
      }}
    >
      {label} {price}
    </Button>
  );
}
