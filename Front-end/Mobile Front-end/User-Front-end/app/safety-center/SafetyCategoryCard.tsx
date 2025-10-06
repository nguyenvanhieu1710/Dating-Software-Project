import React from "react";
import { View } from "react-native";
import { TouchableRipple, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

interface SafetyCategoryCardProps {
  title: string;
  description: string;
  icon: string;
  gradient: [string, string];
  isCompleted: boolean;
  onPress: () => void;
}

export const SafetyCategoryCard: React.FC<SafetyCategoryCardProps> = ({
  title,
  description,
  icon,
  gradient,
  isCompleted,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <TouchableRipple
      onPress={onPress}
      rippleColor={theme.colors.primary}
      style={{
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#F3F4F6",
        backgroundColor: "#fff",
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
        }}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <Ionicons name={icon as any} size={28} color="#fff" />
        </LinearGradient>

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text
              variant="titleMedium"
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: theme.colors.onSurface,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              {title}
            </Text>
            {isCompleted && (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.colors.primary,
                }}
              >
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            )}
          </View>

          <Text
            variant="bodyMedium"
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: theme.colors.onSurfaceVariant,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            {description}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.onSurfaceDisabled}
        />
      </View>
    </TouchableRipple>
  );
};
