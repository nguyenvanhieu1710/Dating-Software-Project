import * as React from "react";
import { Appbar, useTheme } from "react-native-paper";

type Props = {
  onUpload: () => void;
};

export default function PhotoHeader({ onUpload }: Props) {
  const theme = useTheme();

  return (
    <Appbar.Header
      mode="center-aligned"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Appbar.Content
        title="Photo Management"
        titleStyle={{
          fontFamily: theme.fonts.titleLarge.fontFamily,
          fontSize: 20,
        }}
      />
      <Appbar.Action
        icon="plus"
        onPress={onUpload}
        accessibilityLabel="Upload new photo"
      />
    </Appbar.Header>
  );
}
