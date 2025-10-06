import * as React from "react";
import { View, Text } from "react-native";
import { useTheme } from "react-native-paper";

type VerificationStatus = "pending" | "verified" | "rejected";

type Props = {
  status: VerificationStatus;
  size?: "small" | "medium" | "large";
};

export default function VerificationStatusBadge({ status, size = "medium" }: Props) {
  const theme = useTheme();

  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          backgroundColor: "#FFF3CD",
          textColor: "#856404",
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        };
      case "verified":
        return {
          label: "Verified",
          backgroundColor: "#D4EDDA",
          textColor: "#155724",
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        };
      case "rejected":
        return {
          label: "Rejected",
          backgroundColor: "#F8D7DA",
          textColor: "#721C24",
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        };
      default:
        return {
          label: status,
          backgroundColor: theme.colors.surfaceVariant,
          textColor: theme.colors.onSurfaceVariant,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        };
    }
  };

  const config = getStatusConfig();

  const sizeStyles = {
    small: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 11 },
    medium: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 13 },
    large: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 14 },
  };

  return (
    <View
      style={{
        backgroundColor: config.backgroundColor,
        borderRadius: 12,
        alignSelf: "flex-start",
        paddingHorizontal: sizeStyles[size].paddingHorizontal,
        paddingVertical: sizeStyles[size].paddingVertical,
      }}
    >
      <Text
        style={{
          color: config.textColor,
          fontSize: sizeStyles[size].fontSize,
          fontWeight: "600",
          fontFamily: config.fontFamily,
        }}
      >
        {config.label}
      </Text>
    </View>
  );
}