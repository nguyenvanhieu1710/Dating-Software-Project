// components/StatCard.tsx
import React from "react";
import { View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  const theme = useTheme();
  return (
    <Card style={{ flexBasis: "48%", marginBottom: 12 }}>
      <Card.Content style={{ flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons size={28} color={theme.colors.primary} />
        <View style={{ marginLeft: 12 }}>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {title}
          </Text>
          <Text variant="titleLarge">{value}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}
