import React from "react";
import { Card, Text, Button, useTheme } from "react-native-paper";
import FormInput from "./FormInput";

interface LocationSectionProps {
  location: string;
  address: string;
  onUseMyLocation: () => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  location,
  address,
  onUseMyLocation,
}) => {
  const theme = useTheme();
  return (
    <Card
      mode="elevated"
      style={{
        marginBottom: 12,
        backgroundColor: "#FFFFFF",
      }}
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
          Location Information
        </Text>
        <FormInput
          label="Current Location"
          value={location}
          placeholder="Your current location coordinates"
          editable={false}
        />
        <FormInput
          label="Address"
          value={address}
          placeholder="Your current address"
          editable={false}
        />
        <Button
          mode="outlined"
          icon="map-marker"
          onPress={onUseMyLocation}
          buttonColor="#F8F4FF"
          textColor="#8B5CF6"
          style={{
            marginTop: 8,
            borderColor: "#8B5CF6",
            borderWidth: 2,
            borderStyle: "dashed",
          }}
          contentStyle={{
            paddingVertical: 4,
          }}
          labelStyle={{
            fontSize: 14,
            fontWeight: "500",
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Use My Current Location
        </Button>
      </Card.Content>
    </Card>
  );
};

export default LocationSection;