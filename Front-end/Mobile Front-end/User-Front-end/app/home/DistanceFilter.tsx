import React from "react";
import { View } from "react-native";
import { Chip, useTheme, Text } from "react-native-paper";

export default function DistanceFilter({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const theme = useTheme();
  const options = [10, 25, 50, 100];

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        paddingHorizontal: 20,
        paddingVertical: 16,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          color: theme.colors.onSurfaceVariant,
          fontSize: 14,
          marginBottom: 14,
          fontFamily: theme.fonts.bodyMedium.fontFamily,
        }}
      >
        Filter distance
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {options.map((opt) => {
          const isActive = value === opt;
          return (
            <Chip
              key={opt}
              onPress={() => onChange(opt)}
              mode={isActive ? "flat" : "outlined"}
              style={{
                flex: 1,
                marginHorizontal: 5,
                borderRadius: 24,
                justifyContent: "center",
                backgroundColor: isActive
                  ? theme.colors.primary
                  : theme.colors.background,
                borderColor: isActive
                  ? theme.colors.primary
                  : theme.colors.outlineVariant,
                borderWidth: 1.2,
                height: 40,
              }}
              textStyle={{
                color: isActive ? "#fff" : theme.colors.onBackground,
                fontSize: 14,
                fontWeight: "600",
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              {opt} km
            </Chip>
          );
        })}
      </View>
    </View>
  );
}
