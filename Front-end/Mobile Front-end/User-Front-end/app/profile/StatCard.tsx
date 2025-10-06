import React from "react";
import { Card, Text, useTheme } from "react-native-paper";

type Props = {
  label: string;
  value?: string | number;
  onPress?: () => void;
};

export default function StatCard({ label, value, onPress }: Props) {
    const theme = useTheme();
  return (
    <Card
      mode="elevated"
      onPress={onPress}
      style={{ width: 140, borderRadius: 16 }}
    >
      <Card.Content style={{ alignItems: "center", paddingVertical: 12 }}>
        {value !== undefined && (
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}>
            {value}
          </Text>
        )}
        <Text style={{ color: theme.colors.primary, fontFamily: theme.fonts.bodyLarge.fontFamily }}>{label}</Text>
        {value !== undefined && (
          <Text style={{ marginTop: 6, fontWeight: "600", color: theme.colors.primary, fontFamily: theme.fonts.bodyLarge.fontFamily }}>
            GET MORE
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}
