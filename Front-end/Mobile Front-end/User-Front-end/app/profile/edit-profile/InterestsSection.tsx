import React from "react";
import { View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { SelectableItem } from "./SelectableItem";

interface InterestsSectionProps {
  interests: string[];
  selectedInterests: string[];
  onToggleInterest: (interest: string) => void;
}

export const InterestsSection: React.FC<InterestsSectionProps> = ({
  interests,
  selectedInterests,
  onToggleInterest,
}) => {
  const theme = useTheme();
  return (
    <Card
      style={{ marginBottom: 12, backgroundColor: "#FFFFFF" }}
      mode="elevated"
    >
      <Card.Content>
        <Text
          variant="titleMedium"
          style={{
            fontWeight: "bold",
            marginBottom: 12,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Interests
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
          {interests.map((interest) => (
            <SelectableItem
              key={interest}
              label={interest}
              selected={selectedInterests.includes(interest)}
              onPress={() => onToggleInterest(interest)}
            />
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};
