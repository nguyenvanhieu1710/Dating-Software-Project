import React from "react";
import { Card, Text } from "react-native-paper";
import { Image } from "react-native";
import { useTheme } from "react-native-paper";

type OnboardingStepProps = {
  title: string;
  subtitle: string;
  image: number;
};

export default function OnboardingStep({
  title,
  subtitle,
  image,
}: OnboardingStepProps) {
  const theme = useTheme();

  return (
    <>
      <Card
        mode="elevated"
        style={{ marginBottom: 40, borderRadius: 100, overflow: "hidden" }}
      >
        <Image source={image} style={{ width: 200, height: 200 }} />
      </Card>
      <Text
        variant="headlineMedium"
        style={{
          fontWeight: "700",
          textAlign: "center",
          marginBottom: 16,
          color: theme.colors.primary,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        }}
      >
        {title}
      </Text>
      <Text
        variant="bodyMedium"
        style={{
          textAlign: "center",
          lineHeight: 24,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        }}
      >
        {subtitle}
      </Text>
    </>
  );
}
