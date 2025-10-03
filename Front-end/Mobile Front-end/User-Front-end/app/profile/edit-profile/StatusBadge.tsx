import React from "react";
import { View, StyleSheet } from "react-native";
import { Chip, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface StatusBadgeProps {
  status: string;
  verified: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  verified,
}) => {
  const theme = useTheme();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10B981";
      case "verified":
        return "#8B5CF6";
      case "unverified":
        return "#F59E0B";
      case "suspended":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  return (
    <View style={styles.container}>
      <Chip
        style={[styles.badge, { backgroundColor: getStatusColor(status) }]}
        textStyle={styles.text}
        mode="flat"
        theme={{
          fonts: {
            labelLarge: {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          },
        }}
      >
        {status.toUpperCase()}
      </Chip>
      {verified && (
        <Chip
          icon={() => (
            <Ionicons name="checkmark-circle" size={12} color="white" />
          )}
          style={[styles.badge, { backgroundColor: "#10B981" }]}
          textStyle={styles.text}
          mode="flat"
          theme={{
            fonts: {
              labelLarge: {
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              },
            },
          }}
        >
          VERIFIED
        </Chip>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badge: {
    height: 24,
  },
  text: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 12,
  },
});
