import React from "react";
import { View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

interface AccountInfoSectionProps {
  userId: string;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
  popularityScore: number;
}

const AccountInfoSection: React.FC<AccountInfoSectionProps> = ({
  userId,
  createdAt,
  updatedAt,
  lastActiveAt,
  popularityScore,
}) => {
  const theme = useTheme();
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

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
          Account Information
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: "48%",
              marginBottom: 12,
              padding: 12,
              backgroundColor: "#F8F9FA",
              borderRadius: 8,
            }}
          >
            <Text
              variant="bodySmall"
              style={{
                color: "#6B7280",
                fontWeight: "500",
                marginBottom: 4,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              User ID
            </Text>
            <Text
              variant="bodyLarge"
              style={{
                color: "#111827",
                fontWeight: "600",
              }}
            >
              {userId}
            </Text>
          </View>
          {/* <View
            style={{
              width: "48%",
              marginBottom: 12,
              padding: 12,
              backgroundColor: "#F8F9FA",
              borderRadius: 8,
            }}
          >
            <Text
              variant="bodySmall"
              style={{
                color: "#6B7280",
                fontWeight: "500",
                marginBottom: 4,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              Member Since
            </Text>
            <Text
              variant="bodyLarge"
              style={{
                color: "#111827",
                fontWeight: "400",
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              {formatDate(createdAt)}
            </Text>
          </View> */}
          <View
            style={{
              width: "48%",
              marginBottom: 12,
              padding: 12,
              backgroundColor: "#F8F9FA",
              borderRadius: 8,
            }}
          >
            <Text
              variant="bodySmall"
              style={{
                color: "#6B7280",
                fontWeight: "500",
                marginBottom: 4,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              Last Active
            </Text>
            <Text
              variant="bodyLarge"
              style={{
                color: "#111827",
                fontWeight: "400",
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              {formatDate(lastActiveAt)}
            </Text>
          </View>
          <View
            style={{
              width: "48%",
              marginBottom: 12,
              padding: 12,
              backgroundColor: "#F8F9FA",
              borderRadius: 8,
            }}
          >
            <Text
              variant="bodySmall"
              style={{
                color: "#6B7280",
                fontWeight: "500",
                marginBottom: 4,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              Popularity Score
            </Text>
            <Text
              variant="bodyLarge"
              style={{
                color: "#111827",
                fontWeight: "600",
              }}
            >
              {popularityScore || 0}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default AccountInfoSection;