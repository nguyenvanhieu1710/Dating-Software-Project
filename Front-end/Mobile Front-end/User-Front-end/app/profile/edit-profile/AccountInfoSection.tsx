import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

interface AccountInfoSectionProps {
  userId: string;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
  popularityScore: number;
}

export const AccountInfoSection: React.FC<AccountInfoSectionProps> = ({
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
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <Text
          variant="titleMedium"
          style={[
            styles.title,
            {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          ]}
        >
          Account Information
        </Text>
        <View style={styles.grid}>
          <View style={styles.infoItem}>
            <Text
              variant="bodySmall"
              style={[
                styles.label,
                {
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              ]}
            >
              User ID
            </Text>
            <Text variant="bodyLarge" style={styles.value}>
              {userId}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text
              variant="bodySmall"
              style={[
                styles.label,
                {
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              ]}
            >
              Member Since
            </Text>
            <Text variant="bodyLarge" style={styles.value}>
              {formatDate(createdAt)}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text
              variant="bodySmall"
              style={[
                styles.label,
                {
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              ]}
            >
              Last Update
            </Text>
            <Text variant="bodyLarge" style={styles.value}>
              {formatDate(updatedAt)}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text
              variant="bodySmall"
              style={[
                styles.label,
                {
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              ]}
            >
              Last Active
            </Text>
            <Text variant="bodyLarge" style={styles.value}>
              {formatDate(lastActiveAt)}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text
              variant="bodySmall"
              style={[
                styles.label,
                {
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              ]}
            >
              Popularity Score
            </Text>
            <Text variant="bodyLarge" style={styles.value}>
              {popularityScore || 0}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoItem: {
    width: "48%",
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
  },
  label: {
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  value: {
    color: "#111827",
    fontWeight: "600",
  },
});
