import * as React from "react";
import { Chip } from "react-native-paper";
import { useTheme } from "react-native-paper";

type Props = {
  value: number;
  label: string;
  type: "super-like" | "boost";
  size?: "small" | "medium";
};

const BalanceChip = React.memo(({ value, label, type, size = "medium" }: Props) => {
  const getChipColor = () => {
    if (value === 0) return "#9E9E9E"; // Gray for zero
    if (type === "super-like") return value > 5 ? "#4CAF50" : "#FF9800";
    return value > 3 ? "#4CAF50" : "#FF9800";
  };

  const getTextSize = () => size === "small" ? 10 : 12;

  const theme = useTheme();

  return (
    <Chip
      mode="outlined"
      textStyle={{ 
        fontSize: getTextSize(), 
        fontWeight: "600",
        color: getChipColor()
      }}
      style={{
        backgroundColor: getChipColor() + "20",
        borderColor: getChipColor(),
        height: size === "small" ? 28 : 32,
      }}
      theme={{
        fonts: {
          labelLarge: {
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          },
        },
      }}
    >
      {value} {label}
    </Chip>
  );
});

BalanceChip.displayName = "BalanceChip";

export default BalanceChip;