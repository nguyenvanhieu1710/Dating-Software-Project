import React from "react";
import { Card, Text, useTheme } from "react-native-paper";
import FormInput from "./FormInput";

interface BioSectionProps {
  bio: string;
  onUpdateBio: (bio: string) => void;
}

const BioSection: React.FC<BioSectionProps> = ({ bio, onUpdateBio }) => {
  const theme = useTheme();
  return (
    <Card
      style={{
        marginBottom: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
      }}
      mode="elevated"
    >
      <Card.Content>
        <Text
          variant="titleMedium"
          style={{
            marginBottom: 12,
            color: "#374151",
            fontWeight: "600",
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          About Me
        </Text>
        <FormInput
          label="Bio"
          value={bio}
          onChangeText={onUpdateBio}
          placeholder="Tell others about yourself..."
          multiline
          numberOfLines={4}
          maxLength={500}
        />
      </Card.Content>
    </Card>
  );
};

export default BioSection;