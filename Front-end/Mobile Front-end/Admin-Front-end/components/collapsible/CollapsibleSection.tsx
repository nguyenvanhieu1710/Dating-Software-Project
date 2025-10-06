import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  subtitle?: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  requiredFields?: boolean;
};

const CollapsibleSection = ({
  title,
  subtitle,
  isExpanded,
  onToggle,
  children,
  requiredFields = false,
}: Props) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    sectionCard: {
      marginBottom: 16,
      borderRadius: 16,
      elevation: 2,
      backgroundColor: theme.colors.surface,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline + "20",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.onSurface,
      flex: 1,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginTop: 2,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    sectionContent: {
      padding: 16,
      gap: 16,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
  });

  return (
    <Card style={styles.sectionCard}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
        <View style={styles.sectionHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>
              {title}{" "}
              {requiredFields && (
                <Text style={{ color: theme.colors.error }}>*</Text>
              )}
            </Text>
            {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={theme.colors.onSurface}
          />
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.sectionContent}>{children}</View>
      )}
    </Card>
  );
};

export default CollapsibleSection;