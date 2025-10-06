import * as React from "react";
import { View, Text, Image } from "react-native";
import { useTheme } from "react-native-paper";
import { IUserVerification } from "@/types/user-verification";

type Props = {
  verification: IUserVerification;
};

export default function UserInfoSection({ verification }: Props) {
  const theme = useTheme();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={{ marginBottom: 12 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: theme.colors.onSurfaceVariant,
          marginBottom: 4,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: theme.colors.onSurface,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        }}
      >
        {value}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <Image
        source={{ uri: verification.evidence_url }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: theme.colors.surface,
          alignSelf: "center",
          marginBottom: 16,
        }}
      />

      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: theme.colors.onSurface,
          marginBottom: 12,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        }}
      >
        Basic Information
      </Text>

      <InfoRow label="User ID" value={`#${verification.user_id}`} />
      <InfoRow label="Verification Type" value={verification.verification_type} />
      <InfoRow label="Status" value={verification.status} />
      <InfoRow label="Created At" value={formatDate(verification.created_at)} />

      {verification.reviewed_by && (
        <>
          <InfoRow label="Reviewed By" value={`Admin #${verification.reviewed_by}`} />
          <InfoRow label="Reviewed At" value={formatDate(verification.reviewed_at)} />
        </>
      )}

      {verification.notes && (
        <View style={{ marginTop: 8 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: theme.colors.onSurfaceVariant,
              marginBottom: 4,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Notes
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.onSurface,
              lineHeight: 20,
              fontStyle: "italic",
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            {verification.notes}
          </Text>
        </View>
      )}

      <View style={{ marginTop: 8 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: theme.colors.onSurfaceVariant,
            marginBottom: 4,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Evidence URL
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: theme.colors.onSurface,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
          numberOfLines={2}
          ellipsizeMode="middle"
        >
          {verification.evidence_url}
        </Text>
      </View>
    </View>
  );
}