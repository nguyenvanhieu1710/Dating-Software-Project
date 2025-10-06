import React from "react";
import { Card, Title, Paragraph, Badge, TouchableRipple } from "react-native-paper";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

type Props = {
  title: string;
  subtitle?: string;
  count?: string | number;
  onPress?: () => void;
};

const ExploreCard: React.FC<Props> = ({ title, subtitle, count, onPress }) => {
  const theme = useTheme();
  return (
    <Card
      mode="elevated"
      elevation={2}
      style={{
        width: "100%",
        borderRadius: 16,
        backgroundColor: "#fff",
      }}
    >
      <TouchableRipple onPress={onPress} style={{ borderRadius: 16 }}>
        <Card.Content style={{ paddingVertical: 16, paddingHorizontal: 16 }}>
          <View style={{ position: "relative" }}>
            {count ? (
              <Badge
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  backgroundColor: "#ef4444",
                  color: "white",
                }}
              >
                {count}
              </Badge>
            ) : null}
            <Title style={{ fontSize: 16, fontWeight: "700", marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              {title}
            </Title>
            {subtitle ? (
              <Paragraph style={{ fontSize: 13, opacity: 0.75, fontFamily: theme.fonts.bodyLarge.fontFamily }}>
                {subtitle}
              </Paragraph>
            ) : null}
          </View>
        </Card.Content>
      </TouchableRipple>
    </Card>
  );
};

export default ExploreCard;
