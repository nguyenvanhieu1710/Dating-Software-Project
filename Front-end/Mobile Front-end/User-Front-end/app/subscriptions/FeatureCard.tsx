import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Card, Surface, Text, useTheme } from "react-native-paper";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  const theme = useTheme();
  return (
    <Card
      mode="outlined"
      style={{
        marginBottom: 12,
        borderRadius: 12,
      }}
    >
      <Card.Content
        style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
      >
        <Ionicons name={icon as any} size={24} color="#8B5CF6" />
        <Surface
          style={{
            flex: 1,
            backgroundColor: "transparent",
            elevation: 0,
            paddingVertical: 2,
            paddingHorizontal: 4,
            borderWidth: 0,
            shadowColor: "transparent",
          }}
        >
          <Text
            variant="titleMedium"
            style={{
              fontWeight: "600",
              marginBottom: 2,
              color: "#111827",
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            {title}
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: "#6B7280",
              lineHeight: 18,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            {description}
          </Text>
        </Surface>
      </Card.Content>
    </Card>
  );
}
