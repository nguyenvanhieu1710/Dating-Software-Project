import * as React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useTheme, Card } from "react-native-paper";
import { IUserVerification } from "@/types/user-verification";
import VerificationStatusBadge from "./VerificationStatusBadge";

type Props = {
  verification: IUserVerification;
  onClick: (verification: IUserVerification) => void;
};

export default function VerificationQueueCard({ verification, onClick }: Props) {
  const theme = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <Card style={{ marginBottom: 12, borderRadius: 12, elevation: 2, backgroundColor: theme.colors.surface }}>
      <TouchableOpacity onPress={() => onClick(verification)} activeOpacity={0.7}>
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: verification.evidence_url }}
              style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.surfaceVariant, marginRight: 16 }}
            />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: theme.colors.onSurface, marginRight: 8, fontFamily: theme.fonts.bodyLarge.fontFamily }}>
                  User #{verification.user_id}
                </Text>
                <VerificationStatusBadge status={verification.status as any} size="small" />
              </View>
              <Text style={{ fontSize: 12, color: theme.colors.onSurfaceVariant, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}>
                Verification type: {verification.verification_type}
              </Text>
              <Text style={{ fontSize: 12, color: theme.colors.onSurfaceVariant, fontFamily: theme.fonts.bodyLarge.fontFamily }}>
                Created at: {formatDate(verification.created_at)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{ backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginTop: 12 }}
            onPress={() => onClick(verification)}
          >
            <Text style={{ color: theme.colors.onPrimary, fontSize: 14, fontWeight: "600", textAlign: "center", fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              View details
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Card>
  );
}