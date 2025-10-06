import * as React from "react";
import { View, Text } from "react-native";
import { useTheme, ActivityIndicator } from "react-native-paper";
import PrimaryButton from "@/components/buttons/PrimaryButton";

type Props = {
  onVerified: () => void;
  onReject: () => void;
  onFlag: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function VerificationActionsPanel({
  onVerified,
  onReject,
  onFlag,
  loading = false,
  disabled = false,
}: Props) {
  const theme = useTheme();

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: 12,
          padding: 24,
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          style={{
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            textAlign: "center",
            marginTop: 12,
            fontStyle: "italic",
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Processing your request...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 12,
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: theme.colors.onSurface,
          marginBottom: 16,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        }}
      >
        Actions
      </Text>

      <View style={{ gap: 10 }}>
        <PrimaryButton
          title="✓ Verified"
          mode="contained"
          onPress={onVerified}
          disabled={disabled}
          style={{ 
            backgroundColor: "#28A745",
            paddingVertical: 12,
          }}
          labelStyle={{
            fontSize: 15,
            fontWeight: "600",
          }}
        />

        <PrimaryButton
          title="✕ Reject"
          mode="contained"
          onPress={onReject}
          disabled={disabled}
          style={{ 
            backgroundColor: "#DC3545",
            paddingVertical: 12,
          }}
          labelStyle={{
            fontSize: 15,
            fontWeight: "600",
          }}
        />

        <PrimaryButton
          title="⚠ Flag for Review"
          mode="outlined"
          onPress={onFlag}
          disabled={disabled}
          style={{ 
            borderColor: "#FFC107",
            borderWidth: 2,
            paddingVertical: 12,
          }}
          labelStyle={{
            color: "#FFC107",
            fontSize: 15,
            fontWeight: "600",
          }}
        />
      </View>
    </View>
  );
}