import React from "react";
import { View } from "react-native";
import { TouchableRipple, Text, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface SafetyToolCardProps {
  title: string;
  description: string;
  icon: string;
  gradient: [string, string];
  badgeText: string;
  badgeBackgroundColor: string;
  badgeTextColor: string;
  onPress: () => void;
}

const SafetyToolCard: React.FC<SafetyToolCardProps> = ({
  title,
  description,
  icon,
  gradient,
  badgeText,
  badgeBackgroundColor,
  badgeTextColor,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <TouchableRipple
      onPress={onPress}
      rippleColor={theme.colors.primary}
      style={{
        flexDirection: "row",
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#F3F4F6",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          flex: 1,
        }}
      >
        {/* Icon gradient */}
        <LinearGradient
          colors={gradient}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <Ionicons name={icon as any} size={24} color="#fff" />
        </LinearGradient>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text
            variant="titleMedium"
            style={{
              fontSize: 16,
              fontWeight: "700",
              marginBottom: 4,
              color: theme.colors.onSurface,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            {title}
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              fontSize: 14,
              lineHeight: 18,
              color: theme.colors.onSurfaceVariant,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            {description}
          </Text>
        </View>

        {/* Badge */}
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: badgeBackgroundColor,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: badgeTextColor,
            }}
          >
            {badgeText}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
};

export default SafetyToolCard;