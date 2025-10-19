import React from "react";
import { View } from "react-native";
import { TouchableRipple, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

interface SafetyResourceCardProps {
  title: string;
  description: string;
  icon: string;
  gradient: [string, string];
  isOnline?: boolean;
  onPress: () => void;
}

const SafetyResourceCard: React.FC<SafetyResourceCardProps> = ({
  title,
  description,
  icon,
  gradient,
  isOnline,
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
        }}
      >
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
              width: "100%",
              fontSize: 14,
              flexWrap: "wrap",
              lineHeight: 18,
              color: theme.colors.onSurfaceVariant,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            {description}
          </Text>
        </View>        
      </View>
    </TouchableRipple>
  );
};

export default SafetyResourceCard;