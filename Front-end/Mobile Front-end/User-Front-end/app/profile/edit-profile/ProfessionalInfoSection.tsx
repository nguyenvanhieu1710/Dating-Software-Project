import React from "react";
import { Card, Text, useTheme } from "react-native-paper";
import FormInput from "./FormInput";

interface ProfessionalInfoSectionProps {
  formData: {
    job_title: string;
    company: string;
    school: string;
  };
  onUpdateField: (field: string, value: string) => void;
}

const ProfessionalInfoSection: React.FC<
  ProfessionalInfoSectionProps
> = ({ formData, onUpdateField }) => {
  const theme = useTheme();
  return (
    <Card
      style={{
        marginBottom: 12,
        backgroundColor: "#FFFFFF",
      }}
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
          Professional Information
        </Text>
        <FormInput
          label="Job Title"
          value={formData.job_title}
          onChangeText={(text) => onUpdateField("job_title", text)}
          placeholder="What do you do?"
          maxLength={100}
        />
        <FormInput
          label="Company"
          value={formData.company}
          onChangeText={(text) => onUpdateField("company", text)}
          placeholder="Where do you work?"
          maxLength={100}
        />
        <FormInput
          label="School"
          value={formData.school}
          onChangeText={(text) => onUpdateField("school", text)}
          placeholder="Where did you study?"
          maxLength={100}
        />
      </Card.Content>
    </Card>
  );
};

export default ProfessionalInfoSection;