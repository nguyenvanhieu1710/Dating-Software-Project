import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { borderColor: theme.colors.outline }]}>
      <Button
        mode="outlined"
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        textColor={theme.colors.primary}
        theme={{
          fonts: {
            labelLarge: {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          },
        }}
      >
        Prev
      </Button>

      <Text
        style={{
          marginHorizontal: 12,
          color: theme.colors.onSurface,
          fontSize: 14,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        }}
      >
        {currentPage} / {totalPages}
      </Text>

      <Button
        mode="outlined"
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        textColor={theme.colors.primary}
        theme={{
          fonts: {
            labelLarge: {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          },
        }}
      >
        Next
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
});
