import React, { useEffect, useRef, useState } from "react";
import { View, Animated } from "react-native";
import {
  Surface,
  Text,
  IconButton,
  Button,
  useTheme,
} from "react-native-paper";

interface SuggestionPopupProps {
  visible: boolean;
  suggestions: string[];
  onSelect: (text: string) => void;
  onClose: () => void;
}

const SuggestionPopup: React.FC<SuggestionPopupProps> = ({
  visible,
  suggestions,
  onSelect,
  onClose,
}) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
    }

    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (!visible) {
        setIsAnimating(false);
      }
    });
  }, [visible]);

  if (!visible && !isAnimating) return null;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 80,
        zIndex: 9999,
      }}
    >
      <Surface
        style={{
          padding: 8,
          borderRadius: 8,
          elevation: 6,
          backgroundColor: theme.colors.background,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            paddingHorizontal: 4,
          }}
        >
          <Text
            style={{
              fontWeight: "600",
              fontFamily: theme.fonts.bodyLarge?.fontFamily,
            }}
          >
            Quick replies
          </Text>
          <IconButton icon="close" size={18} onPress={onClose} />
        </View>

        {/* Suggestion Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          {suggestions.map((s, idx) => (
            <Button
              key={idx}
              mode="outlined"
              compact
              onPress={() => onSelect(s)}
              style={{
                flex: 1,
                marginHorizontal: 4,
                borderColor: theme.colors.outlineVariant,
              }}
              labelStyle={{
                fontSize: 13,
                fontFamily: theme.fonts.bodyLarge?.fontFamily,
              }}
            >
              {s}
            </Button>
          ))}
        </View>
      </Surface>
    </Animated.View>
  );
};

export default SuggestionPopup;
