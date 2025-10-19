import React from "react";
import { Card, Text, useTheme } from "react-native-paper";
import { View } from "react-native";

export default function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <Card style={{ marginVertical: 8 }}>
      <Card.Content>
        <Text
          variant="titleMedium"
          style={{ marginBottom: 12, color: theme.colors.onSurface }}
        >
          {title}
        </Text>
        <View style={{ alignItems: "center" }}>{children}</View>
      </Card.Content>
    </Card>
  );
}
