import React from "react";
import { View } from "react-native";
import { Card, Text, Button, useTheme } from "react-native-paper";

type Tier = {
  name: string;
  price: string;
  period?: string;
  features: string[];
  badge?: string;
};

export default function UpgradeTier({
  tier,
  onPress,
}: {
  tier: Tier;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const bgMap: any = {
    Gold: { backgroundColor: "#FEF9C3", borderColor: "#FDE047" },
    Platinum: { backgroundColor: "#F0F9FF", borderColor: "#7DD3FC" },
    Plus: { backgroundColor: "#F5F3FF", borderColor: "#DDD6FE" },
  };

  const style = bgMap[tier.name] || {
    backgroundColor: "#FFF",
    borderColor: "#E5E7EB",
  };

  return (
    <Card
      mode="outlined"
      style={{ width: 200, marginRight: 12, borderRadius: 16, ...style }}
    >
      <Card.Content>
        {tier.badge && (
          <Text
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "#7C3AED",
              color: "#fff",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderBottomLeftRadius: 16,
              borderTopRightRadius: 16,
              fontWeight: "700",
              fontSize: 10,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            {tier.badge}
          </Text>
        )}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            textAlign: "center",
            marginTop: 8,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          {tier.name}
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            textAlign: "center",
            marginVertical: 8,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          {tier.price}
          <Text style={{ fontSize: 14, fontWeight: "500", fontFamily: theme.fonts.bodyLarge.fontFamily }}>
            {tier.period ? tier.period : ""}
          </Text>
        </Text>
        <View style={{ marginBottom: 12 }}>
          {tier.features.map((f, i) => (
            <Text
              key={i}
              style={{ fontSize: 12, color: "#4B5563", marginBottom: 6, fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              ✓ {f}
            </Text>
          ))}
        </View>
        <Button mode="contained" onPress={onPress} style={{ borderRadius: 12 }} labelStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
          Choose
        </Button>
      </Card.Content>
    </Card>
  );
}
